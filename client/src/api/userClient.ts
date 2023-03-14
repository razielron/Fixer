import axios, { AxiosResponse } from 'axios';
import path from 'path';
import { UserModel } from '../models/userModel.js';

type GetUsersResponse = {
    data?: UserModel[];
    message?: string;
};

const getEndpoint: string = '';
let createEndpoint: string = '';
let updateEndpoint: string = '';
let deleteEndpoint: string = '';

let headers: object = { Accept: 'application/json' };

async function getUser(userId: string) : Promise<UserModel[] | string> {
    let errorMessage = `Internal error when trying to get user ${userId}`;
    
    try {
        let getUserUrl: string = path.join(getEndpoint, userId);
        const { data } = await 
            axios.get<GetUsersResponse>(getUserUrl, {headers});
        
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

