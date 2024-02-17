import { DeviceType } from './DeviceType';

export type UserData = {
  id?: number;
  username: string;
  password?: string;
  email?: string;
  googleAccessKey: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: DeviceType;
  geolocation?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
