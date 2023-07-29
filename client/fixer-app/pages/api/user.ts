import type { NextApiRequest, NextApiResponse } from 'next';
import { UserModel } from "@/src/models/userModel";
import { userClient } from '@/src/apiClients/userClient';
import {ApiResponseModel} from '@/src/models/apiModel';

async function createUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseModel<UserModel>>
) {
    try {
        let response: ApiResponseModel<UserModel> = await userClient.createUser(JSON.parse(req?.body));
        console.log({response});
        res.status(201).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't create user`});
    }
}

async function getUserByEmail (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<UserModel>>
) {
    try {
        const token = req.headers.authorization as string;
        const email = req?.query?.email as string;
        if(email == null || email == '') throw("no email");
        let response: ApiResponseModel<UserModel> = await userClient.getUserByEmail(email, token);
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't get user by email`});
    }
}

async function getUserById (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<UserModel>>
) {
    try {
        const token = req.headers.authorization as string;
        const userId = req?.query?.id as string;
        if(userId == null || userId == '') throw("no user id");
        let response: ApiResponseModel<UserModel> = await userClient.getUser(userId, token);
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't get user by id`});
    }
}

async function getUsersByProfession (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<UserModel>>
) {
    try {
        const token = req.headers.authorization as string;
        const profession = req?.query?.profession as string;
        if(profession == null || profession == '') throw("no user id");
        let response: ApiResponseModel<UserModel> = await userClient.getUsersByProfession(profession, token);
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't get user by id`});
    }
}

async function getAllUsers (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<UserModel>>
) {
    res.status(404).json({error: `internal error: couldn't get user by id`});
}

async function getUserNavigator(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<UserModel>>
) {
    const email = req?.query?.email as string;
    const userId = req?.query?.id as string;
    const profession = req?.query?.profession as string;

    if(email) {
        await getUserByEmail(req, res);
    } else if(userId) {
        await getUserById(req, res);
    } else if(profession) {
        await getUsersByProfession(req, res);
    }else {
        await getAllUsers(req, res);
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
  
      if (req.method === 'GET'){
          await getUserNavigator(req, res);
      }
      else if (req.method === 'POST'){
          await createUserHandler(req, res);
      }
  
  }