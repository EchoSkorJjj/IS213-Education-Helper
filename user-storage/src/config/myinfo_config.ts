import { MyInfoConfig } from "myinfo-connector-v4-nodejs";

const urlEnvironmentPrefix = process.env.NODE_ENV === "production" ? "" : `${process.env.URL_ENVIRONMENT_PREFIX}.`;

export const APP_CONFIG = {
    MYINFO_CLIENT_ID: process.env.MYINFO_CLIENT_ID, 
    MYINFO_SUBENTITY_ID: process.env.MYINFO_SUBENTITY_ID, //only for platform apps
    // MYINFO_CLIENT_PRIVATE_SIGNING_KEY: process.env.MYINFO_CLIENT_PRIVATE_SIGNING_KEY,
    MYINFO_CLIENT_PRIVATE_SIGNING_KEY: "/app/src/cert/is213-education-helper-signing-private-key.pem",
    // MYINFO_CLIENT_PRIVATE_ENCRYPTION_KEYS: process.env.MYINFO_CLIENT_PRIVATE_ENCRYPTION_KEYS,
    MYINFO_CLIENT_PRIVATE_ENCRYPTION_KEYS: "/app/src/cert/encryption-private-keys/",
    MYINFO_CALLBACK_URL: process.env.MYINFO_CALLBACK_URL,
    MYINFO_PURPOSE_ID: process.env.MYINFO_PURPOSE_ID,
    MYINFO_SCOPES : process.env.MYINFO_SCOPES,
    MYINFO_API_AUTHORIZE: `https://${urlEnvironmentPrefix}api.myinfo.gov.sg/com/v4/authorize`
};

export const MYINFO_CONNECTOR_CONFIG: MyInfoConfig = {
    CLIENT_ID: process.env.MYINFO_CLIENT_ID || '',
    SUBENTITY_ID: process.env.MYINFO_SUBENTITY_ID || '',
    REDIRECT_URL: process.env.MYINFO_CALLBACK_URL || '',
    SCOPE: process.env.MYINFO_SCOPES || '',
    AUTHORIZE_JWKS_URL: `https://${urlEnvironmentPrefix}authorise.singpass.gov.sg/.well-known/keys.json`,
    MYINFO_JWKS_URL: `https://${urlEnvironmentPrefix}authorise.singpass.gov.sg/.well-known/keys.json`,
    TOKEN_URL: `https://${urlEnvironmentPrefix}api.myinfo.gov.sg/com/v4/token`,
    PERSON_URL: `https://${urlEnvironmentPrefix}api.myinfo.gov.sg/com/v4/person`,
    CLIENT_ASSERTION_SIGNING_KID: '', // Assuming it's okay to default to an empty string
    USE_PROXY: "N", // Assuming "N" as default
    PROXY_TOKEN_URL: "", // Empty string as default
    PROXY_PERSON_URL: "", // Empty string as default
    DEBUG_LEVEL: "info" // Assuming "info" as default
};
