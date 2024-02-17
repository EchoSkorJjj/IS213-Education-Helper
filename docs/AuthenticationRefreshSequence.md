    participant "Kong Gateway" as Kong
    participant "AuthController" as AC
    participant "AuthService" as AS
    participant "GoogleAPIService" as GAS
    participant "RedisService" as RS
    participant "UserService" as US
    participant "JWTHandler Middleware" as JWT
    participant "DatabaseService" as DB
    participant Logger
    
    Kong->>AC: POST /token/refresh with { refresh_token }
    alt refresh token is missing
        AC->>Kong: Response 400 { error: 'Refresh token is missing' }
    else refresh token is present
    AC->>Logger: Log incoming request
        AC->>AS: renewAccessToken(refreshToken)
        AS->>JWT: verifyToken(refreshToken)
        JWT-->>AS: Decoded Token
        alt token is revoked or invalid
            AS->>Kong: Response 401 { error: 'Refresh token failed.' }
        else token is valid
            AS->>JWT: createToken(userId, TokenType.Access)
            JWT-->>AS: New Access Token & Cookie Options
            AS-->>AC: New Access Token & Cookie Options
            AC->>Kong: Set Cookie (access_token) & Response 200 { newAccessToken }
        end
    end
