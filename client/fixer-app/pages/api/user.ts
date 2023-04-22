import type { NextApiRequest, NextApiResponse } from 'next';
import { UserModel, GetUsersResponse } from "@/src/models/userModel";
import { userClient } from '@/src/apiClients/userClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserModel[]>
) {
    try {
        let succeed: boolean = await userClient.createUser(JSON.parse(req?.body));
        console.log({succeed});
        if(!succeed) throw new Error('Failed to create user');
        res.status(201).json([]);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json([]);
    }
}