import axios from 'axios';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { PostModel } from '../../src/models/postModel.js';
import {ApiResponseModel} from '@/src/models/apiModel';



const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const getByIdEndpoint: string = '/post/';
const createEndpoint: string = '/post/create';
const updateEndpoint: string = '/post/update';
const deleteEndpoint: string = '/post';

let headers = { Accept: 'application/json', Authorization: '', 'Content-Type': 'application/json'  };

class PostClient {

    public async getAllPosts( token: string) : Promise<ApiResponseModel<PostModel[]>> {
        try {
            let getPostBaseUrl: URL = new URL(getByIdEndpoint, baseUrl);
            let getPostUrl : URL = new URL ( getPostBaseUrl);
            headers.Authorization = token
            const {data} = await axios.get(getPostUrl.toString(), {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to get posts`;
            console.log({error});
            const response: ApiResponseModel<PostModel[]> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async createPost(post: PostModel, token: string) : Promise<ApiResponseModel<PostModel>> {
        
        try {
            let createPostUrl: URL = new URL(createEndpoint, baseUrl);
            headers.Authorization = token;
            const { data } = await axios.post(createPostUrl.toString(), post, {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to create post`;
            console.log({error});
            const response: ApiResponseModel<PostModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async updatePost(post: PostModel, token: string) : Promise<ApiResponseModel<PostModel>> {
        try {
            if(!post.id) throw "missing Post id";
            let updatePostUrl: string = path.join(baseUrl, updateEndpoint, post.id);
            headers.Authorization = token;
            const { data } = await axios.put(updatePostUrl, {data: post}, {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to update post: ${post.id}`;
            console.log({error});
            const response: ApiResponseModel<PostModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async deletePost(postId: string, token: string) : Promise<ApiResponseModel<PostModel>> {
        try {
            let deletePostUrl: string = path.join(baseUrl, deleteEndpoint, postId);
            headers.Authorization = token;
            const { data } = await axios.delete(deletePostUrl, {headers});

            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to delete post: ${postId}`;
            console.log({error});
            const response: ApiResponseModel<PostModel> = {
                error: errorMessage
            }

            return response;
        }
    }
}

let postClient : PostClient = new PostClient();

export {
    postClient
}