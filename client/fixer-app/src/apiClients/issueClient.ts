import axios from 'axios';
import path from 'path';
import { IssueModel } from '../models/issueModel.js';
import {ApiResponseModel} from '@/src/models/apiModel';

const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const getByIdEndpoint: string = '/issue/';
const getByUserIdEndpoint: string = '/issue/user/';
const getByProfessionEndpoint: string = '/issue/profession/';
const createEndpoint: string = '/issue/create/';
const updateEndpoint: string = '/issue/update/';
const deleteEndpoint: string = '/issue/';

let headers = { Accept: 'application/json', Authorization: '', 'Content-Type': 'application/json' };

class IssueClient {

    public async getIssueById(issueId: string, token: string) : Promise<ApiResponseModel<IssueModel>> {
        try {
            let getIssueBaseUrl: URL = new URL(getByIdEndpoint, baseUrl);
            let getIssueUrl : URL = new URL (issueId, getIssueBaseUrl);
            headers.Authorization = token;
            const {data} = await axios.get(getIssueUrl.toString(), {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to get issue ${issueId}`;
            console.log({error});
            const response: ApiResponseModel<IssueModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async getIssueByUserId(userId: string, token: string) : Promise<ApiResponseModel<IssueModel>> {
        try {
            let getIssueUrl: string = path.join(baseUrl, getByUserIdEndpoint, userId);
            headers.Authorization = token;
            const { data } = await axios.get(getIssueUrl, {headers});

            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to get issue ${userId}`;
            console.log({error});
            const response: ApiResponseModel<IssueModel> = {
                error: errorMessage
            }
            
            return response;
        }
    }

    public async getIssueByProfession(profession: string, token: string) : Promise<ApiResponseModel<IssueModel[]>> {
        try {
            let getIssueBaseUrl: URL = new URL(getByProfessionEndpoint, baseUrl);
            let getIssueUrl : URL = new URL (profession, getIssueBaseUrl);
            headers.Authorization = token;
            const { data } = await axios.get(getIssueUrl.toString(), {headers});

            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to get issue ${profession}`;
            console.log({error});
            const response: ApiResponseModel<IssueModel[]> = {
                error: errorMessage
            }
            
            return response;
        }
    }

    public async createIssue(issue: IssueModel, token: string) : Promise<ApiResponseModel<IssueModel>> {
        try {
            console.log({issue})
            let createIssueUrl: URL = new URL(createEndpoint, baseUrl);
            headers.Authorization = token;
            const { data } = await axios.post(createIssueUrl.toString(), issue, {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to create issue`;
            console.log({error});
            const response: ApiResponseModel<IssueModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async updateIssue(issue: IssueModel, token: string) : Promise<ApiResponseModel<IssueModel>> {
        try {
            if(!issue.id) throw "missing issue id";
            let updateIssueUrl: string = path.join(baseUrl, updateEndpoint, issue.id);
            headers.Authorization = token;
            const { data } = await axios.put(updateIssueUrl, {data: issue}, {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to update issue: ${issue.id}`;
            console.log({error});
            const response: ApiResponseModel<IssueModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async deleteIssue(issueId: string, token: string) : Promise<ApiResponseModel<IssueModel>> {
        try {
            let deleteIssueUrl: string = path.join(baseUrl, deleteEndpoint, issueId);
            headers.Authorization = token;
            const { data } = await axios.delete(deleteIssueUrl, {headers});

            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to delete issue: ${issueId}`;
            console.log({error});
            const response: ApiResponseModel<IssueModel> = {
                error: errorMessage
            }

            return response;
        }
    }
}

let issueClient : IssueClient = new IssueClient();

export {
    issueClient
}