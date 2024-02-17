import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserAuth } from './UserAuth';
import { UserDevice } from './UserDevice';
import { UserLocation } from './UserLocation';
import { UserRole } from './UserRole';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  picture: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => UserAuth, (userAuth) => userAuth.user)
  auth: UserAuth;

  @OneToOne(() => UserDevice, (userDevice) => userDevice.user)
  device: UserDevice;

  @OneToOne(() => UserLocation, (userLocation) => userLocation.user)
  location: UserLocation;

  @OneToOne(() => UserRole, (userRole) => userRole.user)
  role: UserRole;
}
