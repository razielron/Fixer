import type { NextApiRequest, NextApiResponse } from 'next';
import type { IssueModel } from '@/src/models/issueModel';
import ApiResponseModel from '@/src/models/apiModel';
import { issueClient } from '@/src/apiClients/issueClient';

async function getIssueByProfessionHandler (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<IssueModel[]>>
) {
    try {
        const token = req.headers.authorization || '';
        let response: ApiResponseModel<IssueModel[]> = await issueClient.getIssueByProfession('ELECTRICIAN', token);
        console.log({response});
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't get issues by profession`});
    }
}

async function createIssueHandler (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<IssueModel>>
) {
    try {
        const token = req.headers.authorization || '';
        let response: ApiResponseModel<IssueModel> = await issueClient.createIssue(JSON.parse(req.body), token);
        console.log({response});
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't create issue`});
    }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if (req.method === 'GET'){
        await getIssueByProfessionHandler(req, res);
    }
    else if (req.method === 'POST'){
        await createIssueHandler(req, res);
    }

}