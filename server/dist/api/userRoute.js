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
import { userRepository } from '../DB/userRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
function getUser(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.userId;
            let user = yield userRepository.getUser(userId);
            if (!user) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let apiResponseModel = {
                data: user
            };
            console.log({ getUser: user });
            res.json(apiResponseModel);
        }
        catch (message) {
            console.error({ message });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't get user ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.issueId}` });
        }
    });
}
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = req.body;
            console.log({ createUser: user });
            yield userRepository.createUser(user);
            res.sendStatus(StatusCodes.CREATED);
        }
        catch (message) {
            console.error({ message });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't create user` });
        }
    });
}
function updateUser(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = req.body;
            console.log({ updateUser: user });
            let updatedUser = yield userRepository.updateUser(user);
            let apiResponseModel = {
                data: updatedUser
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            console.error({ message });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't update user ${(_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.id}` });
        }
    });
}
function deleteUser(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.userId;
            console.log({ deleteUser: userId });
            let user = yield userRepository.deleteUser(userId);
            let apiResponseModel = {
                data: user
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            console.error({ message });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't delete user ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.userId}` });
        }
    });
}
const userRoute = Router();
userRoute.get('/:userId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getUser(req, res); next(); }));
userRoute.post('/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield createUser(req, res); next(); }));
userRoute.put('/update', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield updateUser(req, res); next(); }));
userRoute.delete('/:userId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield deleteUser(req, res); next(); }));
export { userRoute };
//# sourceMappingURL=userRoute.js.map