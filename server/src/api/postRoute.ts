import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PostModel, UserModel } from '../models/dbModels.js';
import { postRepository } from '../DB/postRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
import { userRepository } from '../DB/userRepository.js';
import { s3Service } from '../services/s3Service.js';
import { PostApiModel } from '../models/apiModels.js';

async function getAllPosts(req : Request, res : Response) : Promise<void> {
    try {
        let posts : PostModel[] = await postRepository.getAllPosts();
        let users: UserModel[] = [];
        
        if(posts) {
            let filteredIssues: string[] = posts.map(post => post?.autherId).filter(item => item) as string[];
            users = await userRepository.getUsers(filteredIssues);
        }

        if (!posts || !users) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let postApiModels: PostApiModel[] = await Promise.all(posts.map(async (post) => {
            let user = users.find(user => user?.id === post?.autherId);
            let photoUrlTask;
            let autherPhotoUrlTask;
            
            if(post?.photo) {
                photoUrlTask = s3Service.generateDownloadPresignedUrl(post?.photo);
            }

            if(user?.photo) {
                autherPhotoUrlTask = s3Service.generateDownloadPresignedUrl(user?.photo);
            }

            let [photoUrl, autherPhotoUrl] = await Promise.all([photoUrlTask, autherPhotoUrlTask]);

            return {
                ...post,
                autherName: user?.name,
                photoUrl,
                autherPhotoUrl,
            }
        }));

        res.json({data: postApiModels});
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