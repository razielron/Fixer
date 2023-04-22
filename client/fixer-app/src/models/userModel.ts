import { Role } from '../enums/role.js';

interface UserModel {
    id?: string,
    name?: string,
    email?: string,
    role?: Role,
    password?: string,
    createdAt?: Date,
    updatedAt?: Date,
};

interface GetUsersResponse {
    data?: UserModel[],
    message?: string,
};

export type {UserModel, GetUsersResponse};