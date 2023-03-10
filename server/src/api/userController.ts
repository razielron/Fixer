import express, { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/dbModels.js';
import { userRepository } from '../DB/userRepository.js';

async function getUser(req : Request, res : Response) : Promise<void> {
    let userId : string = req?.params?.userId;

    try {
        let user : UserModel = await userRepository.getUser(userId);
        res.json(user);
    }
    catch(message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function createUser(req : Request, res : Response) : Promise<void> {
    let user : UserModel = req.body;

    try {
        await userRepository.createUser(user);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch (message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function updateUser(req : Request, res : Response) : Promise<void> {
    let user : UserModel = req.body;

    try {
        let updatedUser = await userRepository.updateUser(user);
        res.json(updatedUser);
    }
    catch (message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

async function deleteUser(req : Request, res : Response) : Promise<void> {
    let userId : string = req?.params?.userId;

    try {
        let user : UserModel = await userRepository.deleteUser(userId);
        res.json(user);
    }
    catch(message : unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({message});
    }
}

const userController : Router = Router();

userController.get('/:userId', (req : Request, res : Response, next : NextFunction) => { getUser(req, res); next(); } );
userController.post('/create', (req : Request<{}, {}, UserModel>, res : Response, next : NextFunction) => { createUser(req, res); next(); } );
userController.put('/update', (req : Request<{}, {}, UserModel>, res : Response, next : NextFunction) => { updateUser(req, res); next(); } );
userController.delete('/:userId', (req : Request, res : Response, next : NextFunction) => { deleteUser(req, res); next(); } );

export { 
    userController
}