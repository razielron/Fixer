import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/dbModels.js';
import { userRepository } from '../DB/userRepository.js';

async function getUser(req : Request, res : Response) : Promise<void> {
    try {
        let userId : string = req?.params?.userId;
        let user : UserModel = await userRepository.getUser(userId);

        if(user === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        res.json(user);
    }
    catch(message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function createUser(req : Request, res : Response) : Promise<void> {
    try {
        let user : UserModel = req.body;
        await userRepository.createUser(user);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch (message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function updateUser(req : Request, res : Response) : Promise<void> {
    try {
        let user : UserModel = req.body;
        let updatedUser = await userRepository.updateUser(user);
        res.json(updatedUser);
    }
    catch (message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function deleteUser(req : Request, res : Response) : Promise<void> {
    try {
        let userId : string = req?.params?.userId;
        let user : UserModel = await userRepository.deleteUser(userId);
        res.json(user);
    }
    catch(message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

const userRoute : Router = Router();

userRoute.get('/:userId', async (req : Request, res : Response, next : NextFunction) => { await getUser(req, res); next(); } );
userRoute.post('/create', async (req : Request<{}, {}, UserModel>, res : Response, next : NextFunction) => { await createUser(req, res); next(); } );
userRoute.put('/update', async (req : Request<{}, {}, UserModel>, res : Response, next : NextFunction) => { await updateUser(req, res); next(); } );
userRoute.delete('/:userId', async (req : Request, res : Response, next : NextFunction) => { await deleteUser(req, res); next(); } );

export { 
    userRoute
}