import { DataSource } from "typeorm";
import { User } from "../entities/User";

class DatabaseConnection {
    private static instance: DatabaseConnection;

    private dataSource: DataSource;

    private constructor() {
        this.dataSource = new DataSource({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB || 'user_storage_db',
            entities: [User],
            migrations: [],
            synchronize: false,
            logging: false,
            entitySkipConstructor: true,
        });
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }

        return DatabaseConnection.instance;
    }

    public getDataSource(): DataSource {
        return this.dataSource;
    }
};

export default DatabaseConnection;