import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/dbModels.js';
import { userRepository } from '../DB/userRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
import { ApiResponseModel } from '../models/apiModels.js';
import { s3Service } from '../services/s3Service.js';

async function getAllUsers(req : Request, res : Response) : Promise<void> {
    try {
        let users : UserModel[] = await userRepository.getAllUsers();

        if(!users) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let updatedUsers = Promise.all(users?.map(async (user) => await addPhotosUrlsToUserAsync(user)));
        let apiResponseModel: ApiResponseModel<any> = {
            data: updatedUsers
        };

        res.json(apiResponseModel);
    }
    catch(message : unknown) {
        console.error({message});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: couldn't get all users` });
    }
}

async function getUsersByProfession(req : Request, res : Response) : Promise<void> {
    try {
        let profession: string = req?.params?.profession;

        if (!profession) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let users : UserModel[] = await userRepository.getUsersByProfession(profession);

        if(!users) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let updatedUsers = Promise.all(users?.map(async (user) => await addPhotosUrlsToUserAsync(user)));
        let apiResponseModel: ApiResponseModel<any> = {
            data: updatedUsers
        };

        console.log({getUsersByProfession: users});
        res.json(apiResponseModel);
    }
    catch(message : unknown) {
        console.error({message});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: couldn't get users: ${req?.params?.profession}` });
    }
}

async function getUser(req : Request, res : Response) : Promise<void> {
    try {
        let userId : string = req?.params?.userId;
        let user : UserModel = await userRepository.getUser(userId);

        if(!user) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let updatedUser = await addPhotosUrlsToUserAsync(user);
        let apiResponseModel: ApiResponseModel<any> = {
            data: updatedUser
        };

        console.log({getUser: user});
        res.json(apiResponseModel);
    }
    catch(message : unknown) {
        console.error({message});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: couldn't get user ${req?.params?.userId}` });
    }
}

async function getUserByEmail(req : Request, res : Response) : Promise<void> {
    try {
        let email : string = req?.params?.email;
        let user : UserModel = await userRepository.getUserByEmail(email);

        if(!user) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let updatedUser = await addPhotosUrlsToUserAsync(user);
        let apiResponseModel: ApiResponseModel<any> = {
            data: updatedUser
        };

        console.log({getUser: apiResponseModel});
        res.json(apiResponseModel);
    }
    catch(message : unknown) {
        console.error({message});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: couldn't get user ${req?.params?.email}` });
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
        res.json({ error: `internal error: couldn't create user` });
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
        res.json({ error: `internal error: couldn't update user ${req?.body?.id}` });
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
        res.json({ error: `internal error: couldn't delete user ${req?.params?.userId}` });
    }
}

async function addPhotosUrlsToUserAsync(user: UserModel) : Promise<any> {
    let photoUrl: string | null = null;
    let certificateUrl: string | null = null;

    try {
        if(user?.photo) {
            photoUrl = await s3Service.generateDownloadPresignedUrl(user.photo);
        }

        if(user?.certificate) {
            certificateUrl = await s3Service.generateDownloadPresignedUrl(user.certificate);
        }
    }
    catch (message: unknown) {
        console.error({message});
    }
    finally {
        return {
            ...user,
            photoUrl,
            certificateUrl,
        };
    }
}

const userRoute : Router = Router();

userRoute.get('/:userId', authenticateUser, async (req : Request, res : Response, next : NextFunction) => { await getUser(req, res); next(); } );
userRoute.get('/email/:email', authenticateUser, async (req : Request, res : Response, next : NextFunction) => { await getUserByEmail(req, res); next(); } );
userRoute.get('/profession/:profession', authenticateUser, async (req : Request, res : Response, next : NextFunction) => { await getUsersByProfession(req, res); next(); } );
userRoute.get('/all', authenticateUser, async (req : Request, res : Response, next : NextFunction) => { await getAllUsers(req, res); next(); } );
userRoute.post('/create', async (req : Request<{}, {}, UserModel>, res : Response, next : NextFunction) => { await createUser(req, res); next(); } );
userRoute.put('/update', authenticateUser, async (req : Request<{}, {}, UserModel>, res : Response, next : NextFunction) => { await updateUser(req, res); next(); } );
userRoute.delete('/:userId', authenticateUser, async (req : Request, res : Response, next : NextFunction) => { await deleteUser(req, res); next(); } );

export { 
    userRoute
}