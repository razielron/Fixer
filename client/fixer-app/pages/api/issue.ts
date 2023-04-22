import type { NextApiRequest, NextApiResponse } from 'next'
import type { IssueModel, GetIssuesResponse } from '@/src/models/issueModel'
import { issueClient } from '@/src/apiClients/issueClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IssueModel[]>
) {
    try {
        const token = req.headers.authorization || '';
        let issues: GetIssuesResponse = await issueClient.getIssueByProfession('ELECTRICIAN', token);
        console.log({issues});
        res.status(200).json(issues?.data || []);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json([]);
    }
}