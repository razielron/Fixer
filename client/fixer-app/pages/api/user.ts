import type { NextApiRequest, NextApiResponse } from 'next';
import { UserModel } from "@/src/models/userModel";
import { userClient } from '@/src/apiClients/userClient';
import ApiResponseModel from '@/src/models/apiModel';

export default async function handler(
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