import path from 'path';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import DatabaseConnection from '../models/connection/connection';

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

        const extension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
        const pathToServiceDefinitions = path.resolve(__dirname, '../proto-services', `${protoName}.${extension}`);
        const serviceDefinitions = await import(pathToServiceDefinitions);

        let pathToProto = path.resolve(__dirname, '../../protos/', protoName);
        if (!pathToProto.endsWith('.proto')) pathToProto += '.proto';
        const protoDescriptor = this.loadProto(pathToProto);

        if (protoName === 'health') {
            const serviceClient = ((protoDescriptor as any).grpc.health.v1 as { [key: string]: any })['Health'];
            this.server.addService(serviceClient.service, new serviceDefinitions.default());

            logger.info(`Registered service ${protoName}`);
        } else {
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
    }

    public async start(): Promise<void> {
        if (this.started) {
            logger.error('Server has already started');
            return;
        }

        // Initialise db, even if we are not using it yet.
        // This is to make sure that it is ready when we need it.
        const dataSource = DatabaseConnection.getInstance().getDataSource();
        await dataSource.initialize();

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