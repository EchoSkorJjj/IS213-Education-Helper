declare module 'myinfo-connector-v4-nodejs' {
    export interface MyInfoConfig {
        CLIENT_ID: string;
        SUBENTITY_ID: string;
        REDIRECT_URL: string;
        SCOPE: string;
        AUTHORIZE_JWKS_URL: string;
        MYINFO_JWKS_URL: string;
        TOKEN_URL: string;
        PERSON_URL: string;
        CLIENT_ASSERTION_SIGNING_KID: string;
        USE_PROXY: string;
        PROXY_TOKEN_URL: string;
        PROXY_PERSON_URL: string;
        DEBUG_LEVEL: string;
    }

    export interface PKCECodePair {
        codeVerifier: string;
        codeChallenge: string;
    }

    export interface PersonData {
        [key: string]: any; // Adjusted to allow any property
    }

    // Adjusted for a default export pattern
    class MyInfoConnector {
        constructor(config: MyInfoConfig);

        isInitialized: boolean;
        CONFIG: MyInfoConfig;

        generatePKCECodePair(): PKCECodePair;

        getMyInfoPersonData(
            authCode: string,
            codeVerifier: string,
            privateSigningKey: string,
            privateEncryptionKeys: string[]
        ): Promise<PersonData>;
    }

    // Adjusted to export MyInfoConnector as a default export
    export default MyInfoConnector;
}
