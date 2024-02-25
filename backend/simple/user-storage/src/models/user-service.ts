import { Repository } from "typeorm";
import { User, CreateUserDTO } from "./entities/User";
import DatabaseConnection from "./connection/connection";

class UserDatabaseService {
    private static instance: UserDatabaseService;

    private repository: Repository<User>;

    constructor() {
        const db = DatabaseConnection.getInstance();
        const dataSource = db.getDataSource();
        this.repository = dataSource.getRepository(User);
    }

    public static getInstance(): UserDatabaseService {
        if (!UserDatabaseService.instance) {
            UserDatabaseService.instance = new UserDatabaseService();
        }

        return UserDatabaseService.instance;
    }

    public createQueryBuilder(table: string) {
        return this.repository.createQueryBuilder(table);
    };

    public async findUserByID(user_id: string): Promise<User | null> {
        return await this.repository.findOne({ where: { user_id: user_id } });
    };

    public async findUserByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({ where: { email: email } });
    };

    public async getUsers(options: any): Promise<User[]> {
        return await this.repository.find(options);
    }

    public async createUser(user: CreateUserDTO): Promise<User> {
        return await this.repository.save(user);
    };

    public async updateUser(user: User): Promise<User> {
        return await this.repository.save(user);
    };

    public async deleteUser(user_id: string): Promise<void> {
        await this.repository.delete(user_id);
    };
};

export default UserDatabaseService;