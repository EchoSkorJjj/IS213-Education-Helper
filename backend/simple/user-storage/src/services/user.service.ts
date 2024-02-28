import UserDatabaseService from '../models/user-service';
import { UserInfo, ClientUserData } from '../types';

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
                email: newUser.email,
                role: newUser.role,
                profile_pic: newUser.profile_pic,
                is_paid: newUser.is_paid
            };
        } else {
            return {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile_pic: user.profile_pic,
                is_paid: user.is_paid
            };
        }
    }
}

export default UserService;