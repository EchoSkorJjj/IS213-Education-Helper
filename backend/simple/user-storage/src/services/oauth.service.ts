import { OAuth2Client } from 'google-auth-library';
import MyInfoConnector from "myinfo-connector-v4-nodejs";
import SgidClient from '@opengovsg/sgid-client';
import { MYINFO_CONNECTOR_CONFIG, SGID_CONFIG } from '../config';

class OAuthClientService {
    private static instance: OAuthClientService;
    public readonly myInfoConnector: MyInfoConnector;
    public readonly sgidClient: SgidClient;
    public readonly googleOAuth2Client: OAuth2Client;

    private constructor() {
        this.myInfoConnector = new MyInfoConnector(MYINFO_CONNECTOR_CONFIG);
        this.sgidClient = new SgidClient(SGID_CONFIG);
        this.googleOAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'postmessage',
        );
    }

    public static getInstance(): OAuthClientService {
        if (!OAuthClientService.instance) {
            OAuthClientService.instance = new OAuthClientService();
        }
        return OAuthClientService.instance;
    }
}

export default OAuthClientService;
