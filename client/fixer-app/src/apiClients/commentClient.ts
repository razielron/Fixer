import axios from 'axios';
import path from 'path';
import { CommentModel } from '../models/commentModel.js';
import ApiResponseModel from '@/src/models/apiModel';

const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const getByIdEndpoint: string = '/comment/';
const getByIssueIdEndpoint: string = '/comment/issue/';
const createEndpoint: string = '/comment/create/';
const updateEndpoint: string = '/comment/update/';
const deleteEndpoint: string = '/comment/';

let headers = { Accept: 'application/json', Authorization: '', 'Content-Type': 'application/json' };

class CommentClient {

    public async getCommentById(commentId: string, token: string) : Promise<ApiResponseModel<CommentModel>> {
        try {
            let getCommentBaseUrl: URL = new URL(getByIdEndpoint, baseUrl);
            let getCommentUrl : URL = new URL (commentId, getCommentBaseUrl);
            headers.Authorization = token;
            const {data} = await axios.get(getCommentUrl.toString(), {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to get comment ${commentId}`;
            console.log({error});
            const response: ApiResponseModel<CommentModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async getCommentByIssueId(issueId: string, token: string) : Promise<ApiResponseModel<CommentModel[]>> {
        try {
            let getCommentBaseUrl: URL = new URL(getByIssueIdEndpoint, baseUrl);
            let getCommentUrl : URL = new URL (issueId, getCommentBaseUrl);
            headers.Authorization = token;
            const { data } = await axios.get(getCommentUrl.toString(), {headers});

            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to get comment by issueId ${issueId}`;
            console.log({error});
            const response: ApiResponseModel<CommentModel[]> = {
                error: errorMessage
            }
            
            return response;
        }
    }

    public async createComment(comment: CommentModel, token: string) : Promise<ApiResponseModel<CommentModel>> {
        try {
            console.log({comment})
            let createCommentUrl: URL = new URL(createEndpoint, baseUrl);
            headers.Authorization = token;
            const { data } = await axios.post(createCommentUrl.toString(), comment, {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to create comment`;
            console.log({error});
            const response: ApiResponseModel<CommentModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async updateComment(comment: CommentModel, token: string) : Promise<ApiResponseModel<CommentModel>> {
        try {
            if(!comment.id) throw "missing comment id";
            let updateCommentUrl: string = path.join(baseUrl, updateEndpoint, comment.id);
            headers.Authorization = token;
            const { data } = await axios.put(updateCommentUrl, {data: comment}, {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to update comment: ${comment.id}`;
            console.log({error});
            const response: ApiResponseModel<CommentModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async deleteComment(commentId: string, token: string) : Promise<ApiResponseModel<CommentModel>> {
        try {
            let deleteCommentUrl: string = path.join(baseUrl, deleteEndpoint, commentId);
            headers.Authorization = token;
            const { data } = await axios.delete(deleteCommentUrl, {headers});

            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to delete comment: ${commentId}`;
            console.log({error});
            const response: ApiResponseModel<CommentModel> = {
                error: errorMessage
            }

            return response;
        }
    }
}

let commentClient : CommentClient = new CommentClient();

export {
    commentClient
}