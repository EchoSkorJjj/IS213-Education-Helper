
    participant "Kong Gateway" as Kong
    participant "AuthController" as AC
    participant "AuthService" as AS
    participant "GoogleAPIService" as GAS
    participant "RedisService" as RS
    participant "UserService" as US
    participant "JWTHandler Middleware" as JWT
    participant "DatabaseService" as DB
    participant Logger

    Kong->>AC: POST /google/callback with { code }
    AC->>Logger: Log incoming request
    alt code is missing
        AC->>Kong: Response 400 { error: 'Google access code is missing' }
    else code is present
        AC->>AS: handleGoogleLogin(code, req)
        AS->>GAS: getUserData(access_token)
        GAS-->>AS: userData
        AS->>US: createUser(userData)
        US->>DB: Insert/Update User Data
        DB-->>US: User
        US-->>AS: User
        AS->>JWT: createToken(userId, TokenType.Access/Refresh/Identity)
        JWT-->>AS: Tokens & Cookie Options
        AS-->>AC: Tokens, Cookies, User Info
        AC->>Kong: Set Cookies (access_token, refresh_token, identity_token) & Response 200 { user, role, success: true }
    end
