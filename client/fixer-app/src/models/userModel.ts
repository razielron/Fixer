import { Profession } from '../enums/profession.js';
import { Role } from '../enums/role.js';

interface UserModel {
    id?: string,
    name?: string,
    email?: string,
    role?: Role,
    certificate?: string,
    profession?: string
    password?: string,
    createdAt?: Date,
    updatedAt?: Date,
};

export type {UserModel};