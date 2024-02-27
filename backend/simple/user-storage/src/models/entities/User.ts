import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export interface IUser {
    user_id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_paid: boolean;
    creation_date: Date;
}

export interface CreateUserDTO {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

@Entity({name: 'user_storage_table'})
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    role: string;

    @Column()
    is_paid: boolean;

    @CreateDateColumn()
    creation_date: Date;

    // Constructor is ignored when we initialise our DataSource.
    // This constructor is still required, however, as TypeScript's strict typing
    // enforces that the properties of the class are assigned a value.
    constructor(user: IUser) {
        this.user_id = user.user_id;
        this.username = user.username;
        this.email = user.email;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.role = user.role;
        this.is_paid = user.is_paid;
        this.creation_date = user.creation_date;
    }
}