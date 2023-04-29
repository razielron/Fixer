import axios from 'axios';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { PostModel } from '../../src/models/postModel.js';

type GetPostsResponse = {
    data?: PostModel[];
    message?: string;
};

const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const getEndpoint: string = '/post';
const createEndpoint: string = '/post/create';
const updateEndpoint: string = '/post/update';
const deleteEndpoint: string = '/post';

let headers: object = { Accept: 'application/json' };

class PostClient {

    public async getPost(postId: string) : Promise<PostModel[] | string> {
        let errorMessage = `Internal error when trying to get post ${postId}`;
        
        try {
            let getPostUrl: string = path.join(baseUrl, getEndpoint, postId);
            const { data } = await axios.get<GetPostsResponse>(getPostUrl, {headers});
            
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

    public async createPost(post: PostModel) : Promise<boolean> {
        let errorMessage = `Internal error when trying to create post`;
        
        try {
            let createPostUrl: string = path.join(baseUrl, createEndpoint);
            const { status } = await axios.post<GetPostsResponse>(createPostUrl, {data: post}, {headers});
            
            return status == StatusCodes.CREATED;
        }
        catch(error: unknown) {
            console.log({error});
            return false;
        }
    }

    public async updatePost(post: PostModel) : Promise<PostModel[] | string> {
        let errorMessage = `Internal error when trying to update post: ${post.id}`;
        
        try {
            if(!post.id) throw "missing post id";
            let updatePostUrl: string = path.join(baseUrl, updateEndpoint, post.id);
            const { data } = await axios.put<GetPostsResponse>(updatePostUrl, {data: post}, {headers});
            
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

    public async deletePost(postId: string) : Promise<PostModel[] | string> {
        let errorMessage = `Internal error when trying to delete post: ${postId}`;
        
        try {
            let deletePostUrl: string = path.join(baseUrl, deleteEndpoint, postId);
            const { data } = await axios.delete<GetPostsResponse>(deletePostUrl, {headers});
            
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

let postClient : PostClient = new PostClient();

export {
    postClient
}