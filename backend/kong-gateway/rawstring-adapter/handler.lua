local cjson = require "cjson.safe"

local RawStringAdapterHandler = {
    PRIORITY = 1000,
    VERSION = "1.0",
}

function RawStringAdapterHandler:access(config)
    -- Retrieve the raw body directly without transformation
    local raw_body, err = kong.request.get_raw_body()
    if err or not raw_body then
        kong.log.err("Error reading request body or body is empty: ", err)
        return kong.response.exit(400, { message = "Bad request" })
    end

    -- Attempt to decode and re-encode to ensure it's valid JSON
    local decoded_json, decode_err = cjson.decode(raw_body)
    if decode_err then
        kong.log.err("Failed to decode JSON: ", decode_err)
        return kong.response.exit(400, { message = "Invalid JSON" })
    end

    local encoded_json, encode_err = cjson.encode(decoded_json)
    if encode_err then
        kong.log.err("Failed to re-encode JSON: ", encode_err)
        return kong.response.exit(500, { message = "Internal Server Error" })
    end

    -- Forward the validated and re-encoded JSON
    kong.service.request.set_raw_body(encoded_json)

    -- Optionally, forward headers as is
    local headers = kong.request.get_headers()
    for k, v in pairs(headers) do
        kong.service.request.set_header(k, v)
    end
end

return RawStringAdapterHandler
