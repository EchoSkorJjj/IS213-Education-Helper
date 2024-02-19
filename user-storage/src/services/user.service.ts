import UserDatabaseService from '../models/user-service';
import { GoogleUserInfo } from '../types';

class UserService {
    private userDatabaseService: UserDatabaseService;

    constructor() {
        this.userDatabaseService = UserDatabaseService.getInstance();
    }

    public async findOrCreateUser(userData: GoogleUserInfo) {
        const user = await this.userDatabaseService.findUserByEmail(userData.email);
        if (!user) {
            const newUser = await this.userDatabaseService.createUser({
                username: userData.name,
                email: userData.email,
                first_name: userData.given_name,
                last_name: userData.family_name,
                role: 'User',
            });

            return {
                user_id: newUser.user_id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            };
        } else {
            return {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
            };
        }
    }
}

export default UserService;