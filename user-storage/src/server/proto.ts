import path from 'path';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import logger from '../logger/logger';
import { toPascalCase } from "../utils";

class GRPCServer {
    private static instance: GRPCServer;

    private server: grpc.Server;
    private port: string;
    private started: Boolean;

    private constructor() {
        this.server = new grpc.Server();
        this.port = process.env.GRPC_PORT || '0.0.0.0:50051';
        this.started = false;
    }

    public static getInstance(): GRPCServer {
        if (!GRPCServer.instance) {
            GRPCServer.instance = new GRPCServer();
        }

        return GRPCServer.instance;
    }

    public async registerService(protoName: string): Promise<void> {
        if (this.started) {
            logger.error('Cannot register service after server has started');
            return;
        }

        const pathToServiceDefinitions = path.resolve(__dirname, '../proto-services', `${protoName}.ts`);
        const serviceDefinitions = await import(pathToServiceDefinitions);

        let pathToProto = path.resolve(__dirname, '../../protos/', protoName);
        if (!pathToProto.endsWith('.proto')) pathToProto += '.proto';
        const protoDescriptor = this.loadProto(pathToProto);
        const protoPbKey = protoName + '_pb';

        if (typeof protoDescriptor[protoPbKey] == 'object') {
            const protoServiceKey = toPascalCase(protoName);

            const serviceClient = (protoDescriptor[protoPbKey] as { [key: string]: any })[protoServiceKey];
            this.server.addService(serviceClient.service, new serviceDefinitions.default());

            logger.info(`Registered service ${protoName}`);
        } else {
            logger.error(`Failed to register service ${protoName}: pb object not found`);
        }
    }

    public start(): void {
        if (this.started) {
            logger.error('Server has already started');
            return;
        }

        this.server.bindAsync(this.port, grpc.ServerCredentials.createInsecure(), (err, port) => {
            if (err) {
                logger.error(`Failed to start gRPC server: ${err}`);
                return;
            }

            this.started = true;
            logger.info(`gRPC server started on port ${port}`);
        });
    }

    public shutdown(): Promise<void> {
        logger.info('Shutting down gRPC server...');

        return new Promise((resolve, reject) => {
            this.server.tryShutdown((err) => {
                if (err) {
                    logger.error(`Failed to shutdown gRPC server: ${err}`);
                    reject(err);
                    return;
                }

                logger.info('Successfully shutdown gRPC server');
                resolve();
            });
        });
    }

    private loadProto(pathToProto: string): grpc.GrpcObject {
        if (this.started) {
            logger.error('Cannot load proto after server has started. This should never happen.');
            return {};
        }

        const packageDefinition = protoLoader.loadSync(
            pathToProto,
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true,
            }
        );

        return grpc.loadPackageDefinition(packageDefinition);
    }
}

export default GRPCServer;