import axios from 'axios';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { IssueModel, GetIssuesResponse } from '../../src/models/issueModel.js';

const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const getByIdEndpoint: string = '/issue';
const getByUserIdEndpoint: string = '/issue/user';
const getByProfessionEndpoint: string = '/issue/profession';
const createEndpoint: string = '/issue/create';
const updateEndpoint: string = '/issue/update';
const deleteEndpoint: string = '/issue';

let headers: object = { Accept: 'application/json' };

class IssueClient {

    public async getIssueById(issueId: string) : Promise<GetIssuesResponse> {
        let errorMessage = `Internal error when trying to get issue ${issueId}`;
        
        try {
            let getIssueUrl: string = path.join(baseUrl, getByIdEndpoint, issueId);
            const {data} = await axios.get<GetIssuesResponse>(getIssueUrl, {headers});
            
            return data;
        }
        catch(error: unknown) {
            console.log({error});
            const response: GetIssuesResponse = {
                message: errorMessage
            }

            return response;
        }
    }

    public async getIssueByUserId(userId: string) : Promise<GetIssuesResponse> {
        let errorMessage = `Internal error when trying to get issue ${userId}`;
        
        try {
            let getIssueUrl: string = path.join(baseUrl, getByUserIdEndpoint, userId);
            const { data } = await axios.get<GetIssuesResponse>(getIssueUrl, {headers});

            return data;
        }
        catch(error: unknown) {
            console.log({error});
            const response: GetIssuesResponse = {
                message: errorMessage
            }
            
            return response;
        }
    }

    public async getIssueByProfession(profession: string) : Promise<GetIssuesResponse> {
        let errorMessage = `Internal error when trying to get issue ${profession}`;
        
        try {
            let getIssueUrl: string = path.join(baseUrl, getByProfessionEndpoint, profession);
            const { data } = await axios.get<GetIssuesResponse>(getIssueUrl, {headers});

            return data;
        }
        catch(error: unknown) {
            console.log({error});
            const response: GetIssuesResponse = {
                message: errorMessage
            }
            
            return response;
        }
    }

    public async createIssue(issue: IssueModel) : Promise<boolean> {
        let errorMessage = `Internal error when trying to create issue`;
        
        try {
            let createIssueUrl: string = path.join(baseUrl, createEndpoint);
            const { status } = await axios.post<GetIssuesResponse>(createIssueUrl, {data: issue}, {headers});
            
            return status == StatusCodes.CREATED;
        }
        catch(error: unknown) {
            console.log({error});
            return false;
        }
    }

    public async updateIssue(issue: IssueModel) : Promise<IssueModel[] | string> {
        let errorMessage = `Internal error when trying to update issue: ${issue.id}`;
        
        try {
            if(!issue.id) throw "missing issue id";
            let updateIssueUrl: string = path.join(baseUrl, updateEndpoint, issue.id);
            const { data } = await axios.put<GetIssuesResponse>(updateIssueUrl, {data: issue}, {headers});
            
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

    public async deleteIssue(issueId: string) : Promise<IssueModel[] | string> {
        let errorMessage = `Internal error when trying to delete issue: ${issueId}`;
        
        try {
            let deleteIssueUrl: string = path.join(baseUrl, deleteEndpoint, issueId);
            const { data } = await axios.delete<GetIssuesResponse>(deleteIssueUrl, {headers});
            
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

let issueClient : IssueClient = new IssueClient();

export {
    issueClient
}