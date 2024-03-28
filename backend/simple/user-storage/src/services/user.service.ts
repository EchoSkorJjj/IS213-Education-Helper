import UserDatabaseService from '../models/user-service';
import { UserInfo, ClientUserData, UpdateUserDTO, SaveNoteDTO, DeleteNoteDTO } from '../types';

class UserService {
    private static instance: UserService;

    private userDatabaseService: UserDatabaseService;

    constructor() {
        this.userDatabaseService = UserDatabaseService.getInstance();
    }

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async findOrCreateUser(userData: UserInfo): Promise<ClientUserData> {
        const user = await this.userDatabaseService.findUserByEmail(userData.email);
        if (!user) {
            const newUser = await this.userDatabaseService.createUser({
                username: userData.name,
                email: userData.email,
                first_name: userData.given_name,
                last_name: userData.family_name,
                role: 'User',
                profile_pic: userData.profile_pic,
            });

            return {
                user_id: newUser.user_id,
                username: newUser.username,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role,
                profile_pic: newUser.profile_pic,
                is_paid: newUser.is_paid,
                saved_notes_ids: newUser.saved_notes_ids
            };
        } else {
            return {
                user_id: user.user_id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                profile_pic: user.profile_pic,
                is_paid: user.is_paid,
                saved_notes_ids: user.saved_notes_ids
            };
        }
    }

    public async getUserById(userId: string): Promise<ClientUserData | null> {
        const user = await this.userDatabaseService.findUserById(userId);
        if (!user) {
            return null;
        }

        return user;
    }

    public async updateUser(user: UpdateUserDTO): Promise<ClientUserData> {
        const updatedUser = await this.userDatabaseService.updateUser(user);
        return updatedUser;
    }

    public async deleteUser(userId: string): Promise<boolean> {
        try {
            const result = await this.userDatabaseService.deleteUser(userId);
            if (result.affected && result.affected > 0) {
                return true;
            } else {
                throw new Error("User not found or not deleted");
            }
        } catch (error) {
            throw new Error("Error handling delete user");
        }
    }

    public async saveNotes(notes: SaveNoteDTO): Promise<ClientUserData> {
        const user = await this.userDatabaseService.saveNotes(notes);
        return user;
    }

    public async deleteNotes(notes: DeleteNoteDTO): Promise<ClientUserData> {
        const user = await this.userDatabaseService.deleteNotes(notes);
        return user;
    }
}

export default UserService;