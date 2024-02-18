import logger from '../logger/logger';
import GRPCServer from './proto';

class Server {
    private static instance: Server;

    private server: GRPCServer;

    private constructor() {
        this.server = GRPCServer.getInstance();
        this.registerShutdownEvents();
    }

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }

        return Server.instance;
    }

    public async start(): Promise<void> {
        try {
            await this.server.registerService('user_storage');
            this.server.start();
        } catch (e) {
            logger.error(`Failed to start server: ${e}`);
        }
    }

    private registerShutdownEvents(): void {
        process.on('SIGINT', async () => {
            await this.server.shutdown();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await this.server.shutdown();
            process.exit(0);
        });
    }
};

export default Server;