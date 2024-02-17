import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';

import {
  User,
  UserAuth,
  UserData,
  UserDevice,
  UserDeviceData,
  UserLocation,
  UserLocationData,
  UserRole,
} from '../entity';
import { RoleGroups } from '../types';

import { DatabaseService } from './typeorm.service';

// Define types for user data

class UserService {
  private userRepo: Repository<User>;
  private userAuthRepo: Repository<UserAuth>;
  private userDeviceRepo: Repository<UserDevice>;
  private userLocationRepo: Repository<UserLocation>;
  private userRoleRepo: Repository<UserRole>;
  private dbService: typeof DatabaseService;

  constructor(dbService: typeof DatabaseService) {
    this.dbService = dbService;
    this.initializeRepositories();
  }

  private async initializeRepositories() {
    const db = await this.dbService.initialize();
    this.userRepo = db.getRepository(User);
    this.userAuthRepo = db.getRepository(UserAuth);
    this.userDeviceRepo = db.getRepository(UserDevice);
    this.userLocationRepo = db.getRepository(UserLocation);
    this.userRoleRepo = db.getRepository(UserRole);
  }

  public async createUser(
    userData: UserData,
    deviceData: UserDeviceData,
    locationData: UserLocationData,
    userRole: {
      name: string;
      roles: string[];
    },
  ): Promise<User> {
    const queryRunner = this.dbService.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findOrCreateUser(userData);
      if (!user) {
        await this.createUserAuth(user, userData);
        await this.createUserDevice(user, deviceData);
        await this.createUserLocation(user, locationData);
        await this.createUserRole(user, userRole);
      }
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async findOrCreateUser(userData: UserData): Promise<User> {
    let user = await this.userRepo.findOneBy({ email: userData.email });
    if (!user) {
      user = this.userRepo.create({
        username: userData.name,
        email: userData.email,
        picture: userData.picture,
      });
      user = await this.userRepo.save(user);
    }
    return user;
  }

  private async createUserAuth(user: User, userData: UserData): Promise<void> {
    const userAuth = this.userAuthRepo.create({
      user: user,
      password: randomBytes(16).toString('hex'),
      googleAccessKey: userData.googleAccessKey,
    });
    await this.userAuthRepo.save(userAuth);
  }

  private async createUserDevice(
    user: User,
    deviceData: UserDeviceData,
  ): Promise<void> {
    const userDevice = this.userDeviceRepo.create({
      user: user,
      ipAddress: deviceData.ipAddress,
      userAgent: deviceData.userAgent,
      deviceType: deviceData.deviceType,
    });
    await this.userDeviceRepo.save(userDevice);
  }

  private async createUserLocation(
    user: User,
    locationData: UserLocationData,
  ): Promise<void> {
    const userLocation = this.userLocationRepo.create({
      user: user,
      geolocation: locationData.geolocation,
    });
    await this.userLocationRepo.save(userLocation);
  }

  private async createUserRole(
    user: User,
    userRole: { name: string; roles: string[] },
  ): Promise<void> {
    const userRoleEntity = this.userRoleRepo.create({
      user: user,
      roleGroup: userRole,
    });
    await this.userRoleRepo.save(userRoleEntity);
  }
}

export { RoleGroups, UserData, UserDeviceData, UserLocationData, UserService };
