import axios from 'axios';
import path from 'path';
import { UserModel, GetUsersResponse } from '../../src/models/userModel.js';

const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const getEndpoint: string = '/user/';
const createEndpoint: string = '/user/create/';
const updateEndpoint: string = '/user/update/';
const deleteEndpoint: string = '/user/';

let headers = { Accept: 'application/json', Authorization: '' };

class UserClient {

    public async getUser(userId: string, token: string) : Promise<GetUsersResponse> {
        let errorMessage = `Internal error when trying to get user ${userId}`;
        
        try {
            let getUserBaseUrl: URL = new URL(getEndpoint, baseUrl);
            let getUserUrl : URL = new URL (userId, getUserBaseUrl);
            headers.Authorization = token;
            const {data} = await axios.get(getUserUrl.toString(), {headers});
            const response: GetUsersResponse = { data };
            
            return response;
        }
        catch(error: unknown) {
            console.log({error});
            const response: GetUsersResponse = {
                message: errorMessage
            }

            return response;
        }
    }

    public async createUser(user: UserModel) : Promise<boolean> {
        try {
            let createUserUrl: URL = new URL(createEndpoint, baseUrl);
            console.log({createUserUrl});
            console.log({user});
            const { status } = await axios.post<GetUsersResponse>(createUserUrl.toString(), user, {headers});
            
            return status == 201;
        }
        catch(error: unknown) {
            console.log({error});
            return false;
        }
    }

    public async updateUser(user: UserModel, token: string) : Promise<UserModel[] | string> {
        let errorMessage = `Internal error when trying to update user: ${user.id}`;
        
        try {
            if(!user.id) throw "missing user id";
            let updateUserBaseUrl: URL = new URL(createEndpoint, baseUrl);
            let updateUserUrl: URL = new URL(user.id, updateUserBaseUrl);
            headers.Authorization = token;
            const { data } = await axios.put<GetUsersResponse>(updateUserUrl.toString(), {data: user}, {headers});
            
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

    public async deleteUser(userId: string, token: string) : Promise<UserModel[] | string> {
        let errorMessage = `Internal error when trying to delete user: ${userId}`;
        
        try {
            let deleteUserUrl: string = path.join(baseUrl, deleteEndpoint, userId);
            headers.Authorization = token;
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