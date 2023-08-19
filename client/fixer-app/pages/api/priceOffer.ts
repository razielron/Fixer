import type { NextApiRequest, NextApiResponse } from 'next';
import type { PriceOfferModel } from '@/src/models/priceOfferModel';
import {ApiResponseModel} from '@/src/models/apiModel';
import { priceOfferClient } from '@/src/apiClients/priceOfferClient';

async function getPriceOfferByIssueHandler (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<PriceOfferModel[]>>
) {
    try {
        const token = req.headers.authorization as string;
        const issueId = req.query.issueId as string;
        let response: ApiResponseModel<PriceOfferModel[]> = await priceOfferClient.getPriceOfferByIssueId(issueId, token);
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't get priceOffers by profession`});
    }
}

async function createPriceOfferHandler (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseModel<PriceOfferModel>>
) {
    try {
        const token = req.headers.authorization || '';
        let response: ApiResponseModel<PriceOfferModel> = await priceOfferClient.createPriceOffer(JSON.parse(req.body), token);
        res.status(200).json(response);
    }
    catch(error: unknown) {
        console.log({error});
        res.status(500).json({error: `internal error: couldn't create priceOffer`});
    }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if (req.method === 'GET'){
        await getPriceOfferByIssueHandler(req, res);
    }
    else if (req.method === 'POST'){
        await createPriceOfferHandler(req, res);
    }

}