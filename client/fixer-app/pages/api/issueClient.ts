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

let headers = { Accept: 'application/json', Authorization: '' };

class IssueClient {

    public async getIssueById(issueId: string, token: string) : Promise<GetIssuesResponse> {
        let errorMessage = `Internal error when trying to get issue ${issueId}`;
        
        try {
            let getIssueUrl: string = path.join(baseUrl, getByIdEndpoint, issueId);
            headers.Authorization = `Bearer ${token}`;
            const {data} = await axios.get(getIssueUrl, {headers});
            const response: GetIssuesResponse = { data };
            
            return response;
        }
        catch(error: unknown) {
            console.log({error});
            const response: GetIssuesResponse = {
                message: errorMessage
            }

            return response;
        }
    }

    public async getIssueByUserId(userId: string, token: string) : Promise<GetIssuesResponse> {
        let errorMessage = `Internal error when trying to get issue ${userId}`;
        
        try {
            let getIssueUrl: string = path.join(baseUrl, getByUserIdEndpoint, userId);
            headers.Authorization = `Bearer ${token}`;
            const { data } = await axios.get(getIssueUrl, {headers});
            const response: GetIssuesResponse = { data };

            return response;
        }
        catch(error: unknown) {
            console.log({error});
            const response: GetIssuesResponse = {
                message: errorMessage
            }
            
            return response;
        }
    }

    public async getIssueByProfession(profession: string, token: string) : Promise<GetIssuesResponse> {
        let errorMessage = `Internal error when trying to get issue ${profession}`;
        
        try {
            let getIssueUrl: string = `http://52.5.245.87:5000/issue/profession/${profession}`;
            //let getIssueUrl: string = path.join(baseUrl, getByProfessionEndpoint, profession);
            headers.Authorization = `Bearer ${token}`;
            const { data } = await axios.get(getIssueUrl, {headers});
            const response: GetIssuesResponse = { data };

            return response;
        }
        catch(error: unknown) {
            console.log({error});
            const response: GetIssuesResponse = {
                message: errorMessage
            }
            
            return response;
        }
    }

    public async createIssue(issue: IssueModel, token: string) : Promise<boolean> {
        try {
            let createIssueUrl: string = path.join(baseUrl, createEndpoint);
            headers.Authorization = `Bearer ${token}`;
            const { status } = await axios.post(createIssueUrl, {data: issue}, {headers});
            
            return status == StatusCodes.CREATED;
        }
        catch(error: unknown) {
            console.log({error});
            return false;
        }
    }

    public async updateIssue(issue: IssueModel, token: string) : Promise<IssueModel[] | string> {
        let errorMessage = `Internal error when trying to update issue: ${issue.id}`;
        
        try {
            if(!issue.id) throw "missing issue id";
            let updateIssueUrl: string = path.join(baseUrl, updateEndpoint, issue.id);
            headers.Authorization = `Bearer ${token}`;
            const { data } = await axios.put(updateIssueUrl, {data: issue}, {headers});
            
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

    public async deleteIssue(issueId: string, token: string) : Promise<IssueModel[] | string> {
        let errorMessage = `Internal error when trying to delete issue: ${issueId}`;
        
        try {
            let deleteIssueUrl: string = path.join(baseUrl, deleteEndpoint, issueId);
            headers.Authorization = `Bearer ${token}`;
            const { data } = await axios.delete(deleteIssueUrl, {headers});
            
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