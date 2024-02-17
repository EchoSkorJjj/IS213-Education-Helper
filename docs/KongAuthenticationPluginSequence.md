participant Client
participant Kong Gateway
participant Authentication Service
participant Resource Server

note over Client: Request with cookies\n(access_token, refresh_token, identity_token)

Client->Kong Gateway: HTTP Request
note over Kong Gateway: Extract cookies

alt Path is unauthenticated
    note over Kong Gateway: Allow request without token
    Kong Gateway->Resource Server: Forward request
    Resource Server->Client: Respond
else Path requires authentication
    note over Kong Gateway: Verify access_token
    Kong Gateway->Kong Gateway: Validate Access Token
    alt access_token is valid
        note over Kong Gateway: Verify Identity Token
        Kong Gateway->Kong Gateway: Validate Identity Token

        alt Identity Token is valid
            note over Kong Gateway: Extract user role from Identity Token
            alt Path is authorized for user role
                note over Kong Gateway: Forward claims as headers to Resource Server
                Kong Gateway->Resource Server: Forward request with claims
                Resource Server->Client: Respond
            else Path not authorized for user role
                Kong Gateway->Client: 403 Unauthorized
            end
        else Identity Token is invalid
            Kong Gateway->Client: 401 Invalid identity token
        end
    else access_token is invalid or expired
        note over Kong Gateway: Check refresh_token
        note over Authentication Service: Refresh Token validity is handled by authentication\nserver to accommodate logout logic.

        Kong Gateway->Authentication Service: Request new access_token
        Authentication Service->Kong Gateway: New access_token or 401 Invalid refresh token
        alt New token is valid
            note over Kong Gateway: Verify new access_token\nExtract user role
            alt Path is authorized for user role
                note over Kong Gateway: Forward claims as headers to Resource Server
                Kong Gateway->Resource Server: Forward request with new token and claims
                Resource Server->Client: Respond
            else Path not authorized for user role
                Kong Gateway->Client: 403 Unauthorized
            end
        else New token is invalid or refresh token is invalid (401)
            Kong Gateway->Client: 401 Invalid or Expired Tokens
        end
    end
end
       
note over Client: Processes response
