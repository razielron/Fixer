import axios from 'axios';
import path from 'path';
import { UserModel } from '../../src/models/userModel.js';
import {ApiResponseModel} from '@/src/models/apiModel';

const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const getEndpoint: string = '/user/';
const createEndpoint: string = '/user/create/';
const updateEndpoint: string = '/user/update/';
const deleteEndpoint: string = '/user/';

let headers = { Accept: 'application/json', Authorization: '' };

class UserClient {

    public async getUser(userId: string, token: string) : Promise<ApiResponseModel<UserModel>> {
        try {
            let getUserBaseUrl: URL = new URL(getEndpoint, baseUrl);
            let getUserUrl : URL = new URL (userId, getUserBaseUrl);
            headers.Authorization = token;
            const {data} = await axios.get(getUserUrl.toString(), {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to get user ${userId}`;
            console.log({error});
            const response: ApiResponseModel<UserModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async createUser(user: UserModel) : Promise<ApiResponseModel<UserModel>> {
        try {
            let createUserUrl: URL = new URL(createEndpoint, baseUrl);
            console.log({createUserUrl});
            console.log({user});
            const { data } = await axios.post(createUserUrl.toString(), user, {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to create user`;
            console.log({error});
            const response: ApiResponseModel<UserModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async updateUser(user: UserModel, token: string) : Promise<ApiResponseModel<UserModel>> {
        try {
            if(!user.id) throw "missing user id";
            let updateUserBaseUrl: URL = new URL(createEndpoint, baseUrl);
            let updateUserUrl: URL = new URL(user.id, updateUserBaseUrl);
            headers.Authorization = token;
            const { data } = await axios.put(updateUserUrl.toString(), {data: user}, {headers});

            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to update user: ${user.id}`;
            console.log({error});
            const response: ApiResponseModel<UserModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async deleteUser(userId: string, token: string) : Promise<ApiResponseModel<UserModel>> {
        try {
            let deleteUserUrl: string = path.join(baseUrl, deleteEndpoint, userId);
            headers.Authorization = token;
            const { data } = await axios.delete(deleteUserUrl, {headers});

            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to delete user: ${userId}`;
            console.log({error});
            const response: ApiResponseModel<UserModel> = {
                error: errorMessage
            }

            return response;
        }
    }
}

let userClient : UserClient = new UserClient();

export {
    userClient
}