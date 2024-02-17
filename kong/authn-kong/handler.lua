-- Required libraries
local jwt = require "resty.jwt"
local validators = require "resty.jwt-validators"
local cjson = require "cjson.safe"
local http = require "resty.http"
local ck = require "resty.cookie"

-- Plugin handler
local MyAuthHandler = {
    PRIORITY = 1000,
    VERSION = "1.0",
}

-- Setup the expiration validator
local claim_spec = {
    exp = validators.is_not_expired()
}

-- Function to check if the endpoint is unauthenticated
local function isUnauthenticatedEndpoint(path, unauthenticated_endpoints)
    for _, endpoint in ipairs(unauthenticated_endpoints) do
        if path == endpoint then
            return true
        end
    end
    return false
end

-- Function to check if it is logout endpoint
local function isLogoutEndpoint(path, logout_endpoint)
    return path == logout_endpoint
end

-- Function to verify and decode the token
local function verifyToken(jwt_secret, token)
    local verified_token = jwt:verify(jwt_secret, token, claim_spec)
    return verified_token
end

-- Function to validate the access token
local function validateAccessToken(token, jwt_secret)
    local validated_token = verifyToken(jwt_secret, token)

    if validated_token.verified then
        return true, validated_token.payload, false
    else
        local is_expired = validated_token.reason and string.find(validated_token.reason, "expired") ~= nil
        kong.log.notice("is_expired: ", is_expired)
        return false, nil, is_expired;
    end
end

-- Function to forward claims as headers
local function forwardClaimsAsHeaders(claims)
    if not claims then
        return
    end
    for k, v in pairs(claims) do
        kong.service.request.set_header("X-Claim-" .. k, v)
    end
end

-- Function to get the identity token and verify it
local function getAndVerifyIdentityToken(identityToken, jwt_secret)
    if not identityToken then
        kong.log.err("Identity token not found: ", err)
        return nil, "Identity token not found"
    end

    return verifyToken(jwt_secret, identityToken)
end

-- Function to check if the path is authorized for the user's roles
local function isPathAuthorizedForRole(path, userRole, roleAccessRules)
    for _, role in ipairs(userRole.roles) do
        local allowedPaths = roleAccessRules[role]
        if allowedPaths then
            for _, allowedPath in ipairs(allowedPaths) do
                if path == allowedPath then
                    return true
                end
            end
        end
    end
    return false
end


-- Function for making HTTP POST requests
local function makeHttpPostRequest(endpointUrl, requestBody)
    kong.log.notice("Making HTTP POST request to: ", endpointUrl)

    local httpClient = http.new()
    httpClient:set_timeout(5000)

    local res, err = httpClient:request_uri(endpointUrl, {
        method = "POST",
        headers = {["Content-Type"] = "application/json"},
        body = cjson.encode(requestBody),
    })

    kong.log.notice("Response from endpoint: ", endpointUrl, " - ", res and res.body or "no response")
    kong.log.notice("Error from endpoint: ", endpointUrl, " - ", err or "no error")

    if not res then
        kong.log.err("Failed to make request to: ", endpointUrl, " - ", err)
        return nil, err
    end

    return res, nil
end

-- Function to logout the user
local function logoutUser(refreshToken, logout_url)
    kong.log.notice("Logging out user")
    local res, err = makeHttpPostRequest(logout_url, { refresh_token = refreshToken })

    if not res or res.status ~= 200 then
        kong.log.err("Failed to logout user: ", res and res.body or "no response")
        return nil
    end

    -- Check for Set-Cookie headers and forward them
    local setCookieHeaders = res.headers["Set-Cookie"]
    if setCookieHeaders then
        if type(setCookieHeaders) == "table" then
            -- If there are multiple Set-Cookie headers, set them individually
            for _, cookie in ipairs(setCookieHeaders) do
                kong.response.add_header("Set-Cookie", cookie)
            end
        else
            -- If there is only one Set-Cookie header, set it directly
            kong.response.set_header("Set-Cookie", setCookieHeaders)
        end
    end

    return true
end

-- Function to refresh the access token
local function refreshAccessToken(refreshToken, refresh_url)
    kong.log.notice("Refreshing access token")
    local res, err = makeHttpPostRequest(refresh_url, { refresh_token = refreshToken })

    if not res or res.status ~= 200 then
        kong.log.err("Failed to refresh token: ", res and res.body or "no response")
        return nil
    end

    -- Check for Set-Cookie headers and forward them
    local setCookieHeaders = res.headers["Set-Cookie"]
    if setCookieHeaders then
        if type(setCookieHeaders) == "table" then
            -- If there are multiple Set-Cookie headers, set them individually
            for _, cookie in ipairs(setCookieHeaders) do
                kong.response.add_header("Set-Cookie", cookie)
            end
        else
            -- If there is only one Set-Cookie header, set it directly
            kong.response.set_header("Set-Cookie", setCookieHeaders)
        end
    end

    local body = cjson.decode(res.body)
    return { claims = body.newAccessToken }
end

-- Access phase handler
function MyAuthHandler:access(conf)
    local path = kong.request.get_path()
    kong.log.notice("The path is ", path)

    local cookies, err = ck:new()
    if not cookies then
        return kong.response.exit(500, "Failed to create resty.cookie instance: " .. err)
    end

    local accessToken, err = cookies:get("access_token")
    local refreshToken, err = cookies:get("refresh_token")
    local identityToken, err = cookies:get("identity_token")

    if isUnauthenticatedEndpoint(path, conf.unauthenticated_endpoints) and not accessToken then
        return
    end

    if not accessToken then
        return kong.response.exit(401, "No access token provided")
    end

    if isLogoutEndpoint(path, conf.logout_endpoint) then
        if logoutUser(refreshToken, conf.logout_url) then
            return kong.response.exit(200, "Logged out successfully")
        else
            return kong.response.exit(500, "Failed to logout user")
        end
    end
    -- Get and verify the identity token
    local verifiedIdentityToken, err = getAndVerifyIdentityToken(identityToken, conf.jwt_secret)
    if err or not verifiedIdentityToken or not verifiedIdentityToken.verified then
        return kong.response.exit(401, "Invalid identity token")
    end

    -- Extract user role from claims
    local userRole = verifiedIdentityToken.payload.userRole
    if not userRole then
        return kong.response.exit(401, "User role not found in token")
    end

    -- Check if the path is authorized for the user role
    if not isPathAuthorizedForRole(path, userRole, conf.role_access_rules) then
        return kong.response.exit(403, "Unauthorized for this path")
    end

    local isValid, claims, is_expired = validateAccessToken(accessToken, conf.jwt_secret)

    if isValid then
        forwardClaimsAsHeaders(claims)
    elseif is_expired then
        local newAccessToken = refreshAccessToken(refreshToken, conf.refresh_url)
        if newAccessToken then
            local verifiedToken = verifyToken(newAccessToken, conf.jwt_secret)
            forwardClaimsAsHeaders(verifiedToken.payload)
        else
            if logoutUser(refreshToken, conf.logout_url) then
                return kong.response.exit(200, "Logged out successfully")
            else
                return kong.response.exit(500, "Failed to logout user")
            end
        end
    else
        return kong.response.exit(401, "Invalid access tokens")
    end
end

-- Return the handler
return MyAuthHandler