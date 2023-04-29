import axios from 'axios';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../../src/models/userModel.js';

type GetUsersResponse = {
    data?: UserModel[];
    message?: string;
};

const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const getEndpoint: string = '/user';
const createEndpoint: string = '/user/create';
const updateEndpoint: string = '/user/update';
const deleteEndpoint: string = '/user';

let headers: object = { Accept: 'application/json' };

class UserClient {

    public async getUser(userId: string) : Promise<UserModel[] | string> {
        let errorMessage = `Internal error when trying to get user ${userId}`;
        
        try {
            let getUserUrl: string = path.join(baseUrl, getEndpoint, userId);
            const { data } = await axios.get<GetUsersResponse>(getUserUrl, {headers});
            
            if(data.message) {
                return data.message;
            }

            if(data.data) {
                return data.data;
            }

            return errorMessage
        }
        catch(error: unknown) {
            console.log({error});
            return errorMessage;
        }
    }

    public async createUser(user: UserModel) : Promise<boolean> {
        let errorMessage = `Internal error when trying to create user`;
        
        try {
            let createUserUrl: string = "http://52.5.245.87:5000/user/create";
            //let createUserUrl: string = path.join(baseUrl, createEndpoint);
            const { status } = await axios.post<GetUsersResponse>(createUserUrl, user, {headers});
            
            return status == StatusCodes.CREATED;
        }
        catch(error: unknown) {
            console.log({error});
            return false;
        }
    }

    public async updateUser(user: UserModel) : Promise<UserModel[] | string> {
        let errorMessage = `Internal error when trying to update user: ${user.id}`;
        
        try {
            if(!user.id) throw "missing user id";
            let updateUserUrl: string = path.join(baseUrl, updateEndpoint, user.id);
            const { data } = await axios.put<GetUsersResponse>(updateUserUrl, {data: user}, {headers});
            
            if(data.message) {
                return data.message;
            }

            if(data.data) {
                return data.data;
            }

            return errorMessage
        }
        catch(error: unknown) {
            console.log({error});
            return errorMessage;
        }
    }

    public async deleteUser(userId: string) : Promise<UserModel[] | string> {
        let errorMessage = `Internal error when trying to delete user: ${userId}`;
        
        try {
            let deleteUserUrl: string = path.join(baseUrl, deleteEndpoint, userId);
            const { data } = await axios.delete<GetUsersResponse>(deleteUserUrl, {headers});
            
            if(data.message) {
                return data.message;
            }

            if(data.data) {
                return data.data;
            }

            return errorMessage
        }
        catch(error: unknown) {
            console.log({error});
            return errorMessage;
        }
    }
}

let userClient : UserClient = new UserClient();

export {
    userClient
}