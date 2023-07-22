var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { priceOfferRepository } from '../DB/priceOfferRepository.js';
import { userRepository } from '../DB/userRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
function getPriceOfferById(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let priceOfferId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.priceOfferId;
            let priceOffer = yield priceOfferRepository.getPriceOfferById(priceOfferId);
            let user = null;
            if (priceOffer === null || priceOffer === void 0 ? void 0 : priceOffer.autherId) {
                user = yield userRepository.getUser(priceOffer.autherId);
            }
            if (!priceOffer || !user) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let apiResponseModel = {
                data: Object.assign(Object.assign({}, priceOffer), { autherName: user === null || user === void 0 ? void 0 : user.name })
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't get priceOffer ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.priceOfferId}` });
        }
    });
}
function getPriceOffersByIssueId(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let issueId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.issueId;
            let priceOffers = yield priceOfferRepository.getPriceOffersByIssueId(issueId);
            let users = [];
            if (priceOffers) {
                let filteredPriceOffers = priceOffers.map(priceOffer => priceOffer === null || priceOffer === void 0 ? void 0 : priceOffer.autherId).filter(item => item);
                users = yield userRepository.getUsers(filteredPriceOffers);
            }
            if (!priceOffers || !users) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let priceOfferApiModels = priceOffers.map(priceOffer => {
                let user = users.find(user => (user === null || user === void 0 ? void 0 : user.id) === (priceOffer === null || priceOffer === void 0 ? void 0 : priceOffer.autherId));
                return Object.assign(Object.assign({}, priceOffer), { autherName: user === null || user === void 0 ? void 0 : user.name });
            });
            res.json({ data: priceOfferApiModels });
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't get priceOffer by user ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.userId}` });
        }
    });
}
function createPriceOffer(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let priceOffer = req.body;
            let email = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.cognitoUser) === null || _b === void 0 ? void 0 : _b.email;
            if (!priceOffer || !email) {
                res.status(StatusCodes.BAD_REQUEST);
                res.json({ error: `Missing priceOffer data or valid token` });
                return;
            }
            let user = yield userRepository.getUserByEmail(email);
            priceOffer.autherId = user === null || user === void 0 ? void 0 : user.id;
            yield priceOfferRepository.createPriceOffer(priceOffer);
            res.sendStatus(StatusCodes.CREATED);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't create priceOffer` });
        }
    });
}
function updatePriceOffer(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let priceOffer = req.body;
            // TODO: Verify priceOffer's autherId matches the token
            let updatedPriceOffer = yield priceOfferRepository.updatePriceOffer(priceOffer);
            let apiResponseModel = {
                data: updatedPriceOffer
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't update priceOffer ${(_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.id}` });
        }
    });
}
function deletePriceOffer(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let priceOfferId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.priceOfferId;
            // TODO: Verify priceOffer's autherId matches the token
            let priceOffer = yield priceOfferRepository.deletePriceOffer(priceOfferId);
            let apiResponseModel = {
                data: priceOffer
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't delete priceOffer ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.priceOfferId}` });
        }
    });
}
const priceOfferRoute = Router();
priceOfferRoute.get('/:priceOfferId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getPriceOfferById(req, res); next(); }));
priceOfferRoute.get('/issue/:issueId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getPriceOffersByIssueId(req, res); next(); }));
priceOfferRoute.post('/create', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield createPriceOffer(req, res); next(); }));
priceOfferRoute.put('/update', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield updatePriceOffer(req, res); next(); }));
priceOfferRoute.delete('/:priceOfferId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield deletePriceOffer(req, res); next(); }));
export { priceOfferRoute };
//# sourceMappingURL=priceOfferRoute.js.map