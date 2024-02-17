
    participant "Kong Gateway" as Kong
    participant "AuthController" as AC
    participant "AuthService" as AS
    participant "GoogleAPIService" as GAS
    participant "RedisService" as RS
    participant "UserService" as US
    participant "JWTHandler Middleware" as JWT
    participant "DatabaseService" as DB
    participant Logger
    

    Kong->>AC: POST /logout with { refresh_token }
    AC->>Logger: Log incoming request
    alt refresh token is missing
        AC->>Kong: Response 400 { error: 'Refresh token is missing' }
    else refresh token is present
        AC->>AS: handleLogout(refreshToken)
        AS->>JWT: verifyToken(refreshToken)
        JWT-->>AS: Decoded Token
        AS->>RS: Add uniqueId to revocation list
        RS-->>AS: Confirmation
        AC->>Kong: Clear Cookies (access_token, refresh_token, identity_token) & Response 200 { message: 'Logout successful' }
    end
