import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/dbModels.js';
import { userRepository } from '../DB/userRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
import { ApiResponseModel } from '../models/apiModels.js';

async function getUser(req : Request, res : Response) : Promise<void> {
    try {
        let userId : string = req?.params?.userId;
        let user : UserModel = await userRepository.getUser(userId);

        if(!user) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let apiResponseModel: ApiResponseModel<UserModel> = {
            data: user
        };

        console.log({getUser: user});
        res.json(apiResponseModel);
    }
    catch(message : unknown) {
        console.error({message});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get user ${req?.params?.issueId}` });
    }
}

async function createUser(req : Request, res : Response) : Promise<void> {
    try {
        let user : UserModel = req.body;
        console.log({createUser: user});
        await userRepository.createUser(user);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch (message : unknown) {
        console.error({message});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't create user` });
    }
}

async function updateUser(req : Request, res : Response) : Promise<void> {
    try {
        let user : UserModel = req.body;
        console.log({updateUser: user});
        let updatedUser = await userRepository.updateUser(user);
        let apiResponseModel: ApiResponseModel<UserModel> = {
            data: updatedUser
        };
        res.json(apiResponseModel);
    }
    catch (message : unknown) {
        console.error({message});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't update user ${req?.body?.id}` });
    }
}

async function deleteUser(req : Request, res : Response) : Promise<void> {
    try {
        let userId : string = req?.params?.userId;
        console.log({deleteUser: userId});
        let user : UserModel = await userRepository.deleteUser(userId);
        let apiResponseModel: ApiResponseModel<UserModel> = {
            data: user
        };res.json(apiResponseModel);
    }
    catch(message : unknown) {
        console.error({message});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't delete user ${req?.params?.userId}` });
    }
}

const userRoute : Router = Router();

userRoute.get('/:userId', authenticateUser, async (req : Request, res : Response, next : NextFunction) => { await getUser(req, res); next(); } );
userRoute.post('/create', async (req : Request<{}, {}, UserModel>, res : Response, next : NextFunction) => { await createUser(req, res); next(); } );
userRoute.put('/update', authenticateUser, async (req : Request<{}, {}, UserModel>, res : Response, next : NextFunction) => { await updateUser(req, res); next(); } );
userRoute.delete('/:userId', authenticateUser, async (req : Request, res : Response, next : NextFunction) => { await deleteUser(req, res); next(); } );

export { 
    userRoute
}