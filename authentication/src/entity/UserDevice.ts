import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DeviceType } from '../types/DeviceType';

import { User } from './User';

export interface UserDeviceData {
  ipAddress: string;
  userAgent: string;
  deviceType: DeviceType;
}

@Entity()
export class UserDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.device)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column()
  deviceType: DeviceType;
}
