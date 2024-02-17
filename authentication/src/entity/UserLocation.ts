import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

export interface UserLocationData {
  geolocation: string;
}

@Entity()
export class UserLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.location)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  geolocation: string;
}
