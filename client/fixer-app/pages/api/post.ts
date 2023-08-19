import type { NextApiRequest, NextApiResponse } from 'next';
import type { PostModel } from '@/src/models/postModel';
import {ApiResponseModel} from '@/src/models/apiModel';
import { postClient } from '@/src/apiClients/postClient';

async function getAllPostHandler (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<PostModel[]>>
) {
    try {
        const token = req.headers.authorization as string;
        let response: ApiResponseModel<PostModel[]> = await postClient.getAllPosts(token);
        console.log({response});
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't get posts by profession`});
    }
}

async function createPostHandler (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<PostModel>>
) {
    try {
        const token = req.headers.authorization as string;
        console.log({body:JSON.parse(req.body)})
        let response: ApiResponseModel<PostModel> = await postClient.createPost(JSON.parse(req.body), token);
        console.log({response});
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't create post`});
    }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if (req.method === 'GET'){
        await getAllPostHandler(req, res);
    }
    else if (req.method === 'POST'){
        await createPostHandler(req, res);
    }

}