import { Repository, DeleteResult } from "typeorm";
import { User, CreateUserDTO } from "./entities/User";
import { UpdateUserDTO, SaveNoteDTO, DeleteNoteDTO } from "../types";
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

    public async findUserById(user_id: string): Promise<User | null> {
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

    public async updateUser(user: UpdateUserDTO): Promise<User> {
        return await this.repository.save(user);
    };

    public async deleteUser(user_id: string): Promise<DeleteResult> {
        return await this.repository.delete(user_id);
    };

    public async saveNotes(notes: SaveNoteDTO): Promise<User> {
        const user = await this.findUserById(notes.user_id);
        if (!user) {
            throw new Error('User not found');
        }

        // For each requested note_id, check if it first exists as a saved note
        for (const note_id of notes.notes_ids) {
            const alreadyExists = user.saved_notes_ids.includes(note_id);

            // If it has not been saved, then add it to the user's saved notes
            if (!alreadyExists) {
                user.saved_notes_ids.push(note_id);
            }
        }
        
        return await this.repository.save(user);
    }

    public async deleteNotes(notes: DeleteNoteDTO): Promise<User> {
        const user = await this.findUserById(notes.user_id);
        if (!user) {
            throw new Error('User not found');
        }
        // Remove the notes from the existing notes
        user.saved_notes_ids = user.saved_notes_ids.filter(note => !notes.note_id.includes(note));
        return await this.repository.save(user);
    }

    public async getNotes(user_id: string): Promise<string[]> {
        const user = await this.findUserById(user_id);
        if (!user) {
            throw new Error('User not found');
        }

        const notes_id = user.saved_notes_ids;
        return notes_id;
    }
};

export default UserDatabaseService;