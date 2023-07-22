import { PrismaClient } from '@prisma/client';
import { PriceOfferModel } from '../models/dbModels.js';
import { Prisma as PrismaTypes } from '@prisma/client';

const prisma = new PrismaClient();

class PriceOfferRepository {
    public async getPriceOfferById(priceOfferId: string): Promise<PriceOfferModel> {
        try {
            let where = { id: priceOfferId };
            let priceOffer: PriceOfferModel = await prisma.priceOffer.findFirst({ where });

            return priceOffer;
        }
        catch(error: any) {
            console.log({error});
            throw error;
        }
    }

    public async getPriceOffersByIssueId(issueId: string): Promise<PriceOfferModel[]> {
        try {
            let where = { issueId: issueId };
            let priceOffers: PriceOfferModel[] = await prisma.priceOffer.findMany({ where });

            return priceOffers;
        }
        catch(error: any) {
            console.log({error});
            throw error;
        }
    }

    public async createPriceOffer(priceOffer: PriceOfferModel): Promise<PriceOfferModel> {
        let priceOfferInputModel : PrismaTypes.PriceOfferCreateInput | null = this.getPriceOfferCreateInput(priceOffer);
        
        if (!priceOfferInputModel) {
            throw new Error("Cnnot create PriceOffer. The given priceOffer is not type of PriceOfferCreateInput");
        }

        try {
            let data: PrismaTypes.PriceOfferCreateInput = priceOfferInputModel;
            let createdPriceOffer: PriceOfferModel = await prisma.priceOffer.create({ data });
            return createdPriceOffer;
        }
        catch (error: unknown) {
            console.log({error});
            throw error;
        }
    }

    public async updatePriceOffer(priceOffer: PriceOfferModel): Promise<PriceOfferModel> {
        if (!priceOffer?.id) {
            throw new Error("Missing id to update priceOffer");
        }

        try {
            let where = { id: priceOffer.id };
            let data: PrismaTypes.PriceOfferUncheckedUpdateInput = priceOffer;
            let updatedPriceOffer: PriceOfferModel = await prisma.priceOffer.update({ where, data });

            return updatedPriceOffer;
        }
        catch (error: unknown) {
            console.log({error});
            throw error;
        }
    }

    public async deletePriceOffer(id: string): Promise<PriceOfferModel> {
        try {
            let where = { id };
            let deletedPriceOffer = prisma.priceOffer.delete({ where });

            return deletedPriceOffer;
        }
        catch (error: unknown) {
            console.log({error});
            throw error;
        }
    }

    private getPriceOfferCreateInput(priceOffer: PriceOfferModel): PrismaTypes.PriceOfferCreateInput | null {
        if(!priceOffer?.body || !priceOffer?.price || !priceOffer?.autherId || !priceOffer?.issueId) {
            return null;
        }

        return {
            body: priceOffer.body,
            price: priceOffer.price,
            auther: {
                connect: { id: priceOffer.autherId }
            },
            issue: {
                connect: { id: priceOffer.issueId }
            }
        }
    }
}

let priceOfferRepository: PriceOfferRepository = new PriceOfferRepository();

export {
    priceOfferRepository
}