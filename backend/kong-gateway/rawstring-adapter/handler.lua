local cjson = require "cjson.safe"

local RawStringAdapterHandler = {
    PRIORITY = 1000,
    VERSION = "1.0",
}

function RawStringAdapterHandler:access(config)
    local raw_body, err = kong.request.get_raw_body()
    if err then
        kong.log.err("Error reading request body: ", err)
        return
    end

    local body_json = cjson.encode(raw_body)
    if not body_json then
        kong.log.err("Failed to encode JSON")
        return
    end

    local headers = kong.request.get_headers()
    for k, v in pairs(headers) do
        kong.service.request.set_header(k, v)
    end

    kong.service.request.set_raw_body(body_json)
end

return RawStringAdapterHandler
