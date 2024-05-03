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

local health_check_path = "/api/v1/healthz"

-- Access phase handler
function MyAuthHandler:access(conf)
    local path = kong.request.get_path()
    local publicPaths = conf.public_paths;

    kong.log.notice("The path is ", path)

    -- Exit if the path is the health check path
    if path == health_check_path then
        return kong.response.exit(200, { message = "OK" })
    end

    for i, pub_path in ipairs(publicPaths) do
        if pub_path == path then
            return
        end
    end

    local token = kong.request.get_header("Authorization")
    -- Exit if the Authorization header is missing
    if token == nil then
        return kong.response.exit(401, { message = "Unauthorized" })
    end

    -- Remove "Bearer " from the start of the token
    token = string.gsub(token, "Bearer%s+", "")
    if token == "" then 
        return kong.response.exit(401, { message = "Unauthorized" })
    end

    kong.log.notice("The token is ", token)
    -- Verify the token
    local decoded_token, err = jwt:verify(conf.jwt_secret, token, claim_spec)

    if not decoded_token or err or not decoded_token.verified then
        local message = err or "Token is expired or invalid"
        kong.log.err("Error decoding token: ", message)
        return kong.response.exit(401, { message = "Unauthorized: " .. tostring(message) })
    end    

    kong.log.notice("The decoded token is ", cjson.encode(decoded_token))
    local userId = decoded_token.payload.user_id
    kong.log.notice("The user id is ", userId)

    -- Inject the user ID into the request header
    kong.service.request.set_header("x-user-id", userId)
end

-- Return the handler
return MyAuthHandler