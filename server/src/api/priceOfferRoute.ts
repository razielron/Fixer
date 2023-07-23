import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PriceOfferModel, UserModel } from '../models/dbModels.js';
import { priceOfferRepository } from '../DB/priceOfferRepository.js';
import { userRepository } from '../DB/userRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
import { ApiResponseModel, PriceOfferApiModel } from '../models/apiModels.js';

async function getPriceOfferById(req: Request, res: Response): Promise<void> {
    try {
        let priceOfferId: string = req?.params?.priceOfferId;
        let priceOffer: PriceOfferModel = await priceOfferRepository.getPriceOfferById(priceOfferId);
        let user: UserModel = null;

        if(priceOffer?.autherId) {
            user = await userRepository.getUser(priceOffer.autherId);
        }

        if (!priceOffer || !user) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let apiResponseModel: ApiResponseModel<PriceOfferApiModel> = {
            data: {
                ...priceOffer,
                autherName: user?.name
            }
        };

        res.json(apiResponseModel);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get priceOffer ${req?.params?.priceOfferId}` });
    }
}

async function getPriceOffersByIssueId(req: Request, res: Response): Promise<void> {
    try {
        let issueId: string = req?.params?.issueId;
        let priceOffers: PriceOfferModel[] = await priceOfferRepository.getPriceOffersByIssueId(issueId);
        let users: UserModel[] = [];
        
        if(priceOffers) {
            let filteredPriceOffers: string[] = priceOffers.map(priceOffer => priceOffer?.autherId).filter(item => item) as string[];
            users = await userRepository.getUsers(filteredPriceOffers);
        }

        if (!priceOffers || !users) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let priceOfferApiModels: PriceOfferApiModel[] = priceOffers.map(priceOffer => {
            let user = users.find(user => user?.id === priceOffer?.autherId);
            return {
                ...priceOffer,
                autherName: user?.name
            }
        });

        res.json({data: priceOfferApiModels});
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get priceOffer by user ${req?.params?.userId}` });
    }
}

async function createPriceOffer(req: Request, res: Response): Promise<void> {
    try {
        let priceOffer: PriceOfferModel = req.body;
        let email: string = req?.body?.cognitoUser?.email;

        if(!priceOffer || !email || !priceOffer?.price) {
            res.status(StatusCodes.BAD_REQUEST);
            res.json({ error: `Missing priceOffer data or valid token` });
            return;
        }

        let user: UserModel = await userRepository.getUserByEmail(email);
        priceOffer.autherId = user?.id;
        priceOffer.price = parseFloat(priceOffer.price.toString());
        await priceOfferRepository.createPriceOffer(priceOffer);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't create priceOffer` });
    }
}

async function updatePriceOffer(req: Request, res: Response): Promise<void> {
    try {
        let priceOffer: PriceOfferModel = req.body;
        // TODO: Verify priceOffer's autherId matches the token
        let updatedPriceOffer: PriceOfferModel = await priceOfferRepository.updatePriceOffer(priceOffer);
        let apiResponseModel: ApiResponseModel<PriceOfferModel> = {
            data: updatedPriceOffer
        }
        res.json(apiResponseModel);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't update priceOffer ${req?.body?.id}` });
    }
}

async function deletePriceOffer(req: Request, res: Response): Promise<void> {
    try {
        let priceOfferId: string = req?.params?.priceOfferId;
        // TODO: Verify priceOffer's autherId matches the token
        let priceOffer: PriceOfferModel = await priceOfferRepository.deletePriceOffer(priceOfferId);
        let apiResponseModel: ApiResponseModel<PriceOfferModel> = {
            data: priceOffer
        }
        res.json(apiResponseModel);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't delete priceOffer ${req?.params?.priceOfferId}` });
    }
}

const priceOfferRoute: Router = Router();

priceOfferRoute.get('/:priceOfferId', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await getPriceOfferById(req, res); next(); });
priceOfferRoute.get('/issue/:issueId', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await getPriceOffersByIssueId(req, res); next(); });
priceOfferRoute.post('/create', authenticateUser, async (req: Request<{}, {}, PriceOfferModel>, res: Response, next: NextFunction) => { await createPriceOffer(req, res); next(); });
priceOfferRoute.put('/update', authenticateUser, async (req: Request<{}, {}, PriceOfferModel>, res: Response, next: NextFunction) => { await updatePriceOffer(req, res); next(); });
priceOfferRoute.delete('/:priceOfferId', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await deletePriceOffer(req, res); next(); });

export {
    priceOfferRoute
}