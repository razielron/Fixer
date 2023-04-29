import { Role } from '../enums/role.js';

export interface UserModel {
    id?: string,
    name?: string,
    email?: string,
    role?: Role,
    password?: string,
    createdAt?: Date,
    updatedAt?: Date,
}