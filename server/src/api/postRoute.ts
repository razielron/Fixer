import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PostModel } from '../models/dbModels.js';
import { postRepository } from '../DB/postRepository.js';

async function getPost(req : Request, res : Response) : Promise<void> {
    let postId : string = req?.params?.postId;

    try {
        let post : PostModel = await postRepository.getPost(postId);
        res.json(post);
    }
    catch(message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function createPost(req : Request, res : Response) : Promise<void> {
    let post : PostModel = req.body;

    try {
        await postRepository.createPost(post);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch (message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function updatePost(req : Request, res : Response) : Promise<void> {
    let post : PostModel = req.body;

    try {
        let updatedPost = await postRepository.updatePost(post);
        res.json(updatedPost);
    }
    catch (message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function deletePost(req : Request, res : Response) : Promise<void> {
    let postId : string = req?.params?.postId;

    try {
        let post : PostModel = await postRepository.deletePost(postId);
        res.json(post);
    }
    catch(message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

const postRoute : Router = Router();

postRoute.get('/:postId', (req : Request, res : Response, next : NextFunction) => { getPost(req, res); next(); } );
postRoute.post('/create', (req : Request<{}, {}, PostModel>, res : Response, next : NextFunction) => { createPost(req, res); next(); } );
postRoute.put('/update', (req : Request<{}, {}, PostModel>, res : Response, next : NextFunction) => { updatePost(req, res); next(); } );
postRoute.delete('/:postId', (req : Request, res : Response, next : NextFunction) => { deletePost(req, res); next(); } );

export { 
    postRoute
}