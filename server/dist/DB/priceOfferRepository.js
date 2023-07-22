var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class PriceOfferRepository {
    getPriceOfferById(priceOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { id: priceOfferId };
                let priceOffer = yield prisma.priceOffer.findFirst({ where });
                return priceOffer;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    getPriceOffersByIssueId(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { issueId: issueId };
                let priceOffers = yield prisma.priceOffer.findMany({ where });
                return priceOffers;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    createPriceOffer(priceOffer) {
        return __awaiter(this, void 0, void 0, function* () {
            let priceOfferInputModel = this.getPriceOfferCreateInput(priceOffer);
            if (!priceOfferInputModel) {
                throw new Error("Cnnot create PriceOffer. The given priceOffer is not type of PriceOfferCreateInput");
            }
            try {
                let data = priceOfferInputModel;
                let createdPriceOffer = yield prisma.priceOffer.create({ data });
                return createdPriceOffer;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    updatePriceOffer(priceOffer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(priceOffer === null || priceOffer === void 0 ? void 0 : priceOffer.id)) {
                throw new Error("Missing id to update priceOffer");
            }
            try {
                let where = { id: priceOffer.id };
                let data = priceOffer;
                let updatedPriceOffer = yield prisma.priceOffer.update({ where, data });
                return updatedPriceOffer;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    deletePriceOffer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { id };
                let deletedPriceOffer = prisma.priceOffer.delete({ where });
                return deletedPriceOffer;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    getPriceOfferCreateInput(priceOffer) {
        if (!(priceOffer === null || priceOffer === void 0 ? void 0 : priceOffer.body) || !(priceOffer === null || priceOffer === void 0 ? void 0 : priceOffer.price) || !(priceOffer === null || priceOffer === void 0 ? void 0 : priceOffer.autherId) || !(priceOffer === null || priceOffer === void 0 ? void 0 : priceOffer.issueId)) {
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
        };
    }
}
let priceOfferRepository = new PriceOfferRepository();
export { priceOfferRepository };
//# sourceMappingURL=priceOfferRepository.js.map