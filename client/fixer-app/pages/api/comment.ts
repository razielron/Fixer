import type { NextApiRequest, NextApiResponse } from 'next';
import type { CommentModel } from '@/src/models/commentModel';
import {ApiResponseModel} from '@/src/models/apiModel';
import { commentClient } from '@/src/apiClients/commentClient';

async function getCommentByIssueHandler (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<CommentModel[]>>
) {
    try {
        const token = req.headers.authorization as string;
        const issueId = req.query.issueId as string;
        let response: ApiResponseModel<CommentModel[]> = await commentClient.getCommentByIssueId(issueId, token);
        console.log({response});
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't get comments by profession`});
    }
}

async function createCommentHandler (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<CommentModel>>
) {
    try {
        const token = req.headers.authorization || '';
        let response: ApiResponseModel<CommentModel> = await commentClient.createComment(JSON.parse(req.body), token);
        console.log({response});
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't create comment`});
    }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if (req.method === 'GET'){
        await getCommentByIssueHandler(req, res);
    }
    else if (req.method === 'POST'){
        await createCommentHandler(req, res);
    }

}