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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
  
      if (req.method === 'GET'){
          await getUserByEmail(req, res);
      }
      else if (req.method === 'POST'){
          await createUserHandler(req, res);
      }
  
  }