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

-- TODO: HANDLE TOKEN VERIFICATION


-- Access phase handler
function MyAuthHandler:access(conf)
    local path = kong.request.get_path()
    local publicPaths = conf.public_paths;

    kong.log.notice("The path is ", path)

    for i, pub_path in ipairs(publicPaths) do
        if pub_path == path then
        return
        end
    end
    local token = kong.request.get_header("Authorization")
    -- remove bearer and take the token only
    token = string.gsub(token, "Bearer ", "")
    kong.log.notice("The token is ", token)
    if token == nil then
        kong.response.exit(401, { message = "Unauthorized" })
    end
    kong.log.notice("The token is ", token)
    local decoded_token, err = jwt:verify(conf.jwt_secret, token, claim_spec)

    if err then
        kong.log.err("Error decoding token: ", err)
        kong.response.exit(401, { message = "Unauthorized" })
    end
    kong.log.notice("The decoded token is ", cjson.encode(decoded_token))
    local userId = decoded_token.payload.user_id
    kong.log.notice("The user id is ", userId)

    kong.service.request.set_header("x-user-id", userId)
end

-- Return the handler
return MyAuthHandler