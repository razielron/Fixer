import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PostModel, UserModel } from '../models/dbModels.js';
import { postRepository } from '../DB/postRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
import { userRepository } from '../DB/userRepository.js';

async function getAllPosts(req : Request, res : Response) : Promise<void> {
    try {
        let post : PostModel[] = await postRepository.getAllPosts();

        if(post === null || post.length === 0) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        res.json(post);
    }
    catch(message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function getPost(req : Request, res : Response) : Promise<void> {
    try {
        let postId : string = req?.params?.postId;
        let post : PostModel = await postRepository.getPost(postId);

        if(post === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        res.json(post);
    }
    catch(message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function createPost(req : Request, res : Response) : Promise<void> {
    try {
        let post : PostModel = req.body;
        let email: string = req?.body?.cognitoUser?.email;

        if(!post || !email) {
            res.status(StatusCodes.BAD_REQUEST);
            res.json({ error: `Missing post data or valid token` });
            return;
        }
        
        let user: UserModel = await userRepository.getUserByEmail(email);
        post.autherId = user?.id;
        await postRepository.createPost(post);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch (message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function updatePost(req : Request, res : Response) : Promise<void> {
    try {
        let post : PostModel = req.body;
        let updatedPost = await postRepository.updatePost(post);
        res.json(updatedPost);
    }
    catch (message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function deletePost(req : Request, res : Response) : Promise<void> {
    try {
        let postId : string = req?.params?.postId;
        let post : PostModel = await postRepository.deletePost(postId);
        res.json(post);
    }
    catch(message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

const postRoute : Router = Router();

postRoute.get('/', authenticateUser, async (req : Request, res : Response, next : NextFunction) => { await getAllPosts(req, res); next(); } );
postRoute.get('/:postId', authenticateUser, async (req : Request, res : Response, next : NextFunction) => { await getPost(req, res); next(); } );
postRoute.post('/create', authenticateUser, async (req : Request<{}, {}, PostModel>, res : Response, next : NextFunction) => { await createPost(req, res); next(); } );
postRoute.put('/update', authenticateUser, async (req : Request<{}, {}, PostModel>, res : Response, next : NextFunction) => { await updatePost(req, res); next(); } );
postRoute.delete('/:postId', authenticateUser, async (req : Request, res : Response, next : NextFunction) => { await deletePost(req, res); next(); } );

export { 
    postRoute
}