import { Role } from '../enums/role.js';

interface UserModel {
    id?: string,
    email?: string,
    name?: string,
    firstName?: string,
    lastName?: string,
    address?: string,
    phoneNumber?: string,
    photo?: string,
    photoUrl?: string,
    role?: Role,
    certificate?: string,
    profession?: string
    password?: string,
    photoUrl?: string,
    createdAt?: Date,
    updatedAt?: Date,
};

export type {UserModel};