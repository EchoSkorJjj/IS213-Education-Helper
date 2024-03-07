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
    userId = 123456
    kong.service.request.set_header("x-user-id", userId)
end

-- Return the handler
return MyAuthHandler