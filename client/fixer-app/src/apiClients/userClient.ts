import axios from 'axios';
import path from 'path';
import { UserModel } from '../../src/models/userModel.js';
import {ApiResponseModel} from '@/src/models/apiModel';

const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const getEndpoint: string = '/user/';
const getByEmailEndpoint: string = '/user/email/';
const getByProfessionEndpoint: string = '/user/profession/';
const createEndpoint: string = '/user/create/';
const updateEndpoint: string = '/user/update/';
const deleteEndpoint: string = '/user/';

let headers = { Accept: 'application/json', Authorization: '' };

class UserClient {

    public async getUser(userId: string, token: string) : Promise<ApiResponseModel<UserModel>> {
        try {
            let getUserBaseUrl: URL = new URL(getEndpoint, baseUrl);
            let getUserUrl: URL = new URL (userId, getUserBaseUrl);
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

    public async getUserByEmail(email: string, token: string) : Promise<ApiResponseModel<UserModel>> {
        try {
            let getUserBaseUrl: URL = new URL(getByEmailEndpoint, baseUrl);
            let getUserUrl: URL = new URL (email, getUserBaseUrl);
            headers.Authorization = token;
            const {data} = await axios.get(getUserUrl.toString(), {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to get user ${email}`;
            console.log({error});
            const response: ApiResponseModel<UserModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async getUsersByProfession(profession: string, token: string) : Promise<ApiResponseModel<UserModel>> {
        try {
            let getUserBaseUrl: URL = new URL(getByProfessionEndpoint, baseUrl);
            let getUserUrl: URL = new URL (profession, getUserBaseUrl);
            headers.Authorization = token;
            const {data} = await axios.get(getUserUrl.toString(), {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to get user ${profession}`;
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
            let updateUserBaseUrl: URL = new URL(updateEndpoint, baseUrl);
            headers.Authorization = token;
            const { data } = await axios.put(updateUserBaseUrl.toString(), user, {headers});

            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to update user`;
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