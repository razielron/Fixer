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
import { s3Service } from '../services/s3Service.js';
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let users = yield userRepository.getAllUsers();
            if (!users) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let updatedUsers = yield Promise.all(users === null || users === void 0 ? void 0 : users.map((user) => __awaiter(this, void 0, void 0, function* () { return yield addPhotosUrlsToUserAsync(user); })));
            let apiResponseModel = {
                data: updatedUsers
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            console.error({ message });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: couldn't get all users` });
        }
    });
}
function getUsersByProfession(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let profession = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.profession;
            if (!profession) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let users = yield userRepository.getUsersByProfession(profession);
            if (!users) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let updatedUsers = yield Promise.all(users === null || users === void 0 ? void 0 : users.map((user) => __awaiter(this, void 0, void 0, function* () { return yield addPhotosUrlsToUserAsync(user); })));
            let apiResponseModel = {
                data: updatedUsers
            };
            console.log({ getUsersByProfession: users });
            res.json(apiResponseModel);
        }
        catch (message) {
            console.error({ message });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: couldn't get users: ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.profession}` });
        }
    });
}
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
            let updatedUser = yield addPhotosUrlsToUserAsync(user);
            let apiResponseModel = {
                data: updatedUser
            };
            console.log({ getUser: user });
            res.json(apiResponseModel);
        }
        catch (message) {
            console.error({ message });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: couldn't get user ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.userId}` });
        }
    });
}
function getUserByEmail(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let email = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.email;
            let user = yield userRepository.getUserByEmail(email);
            if (!user) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let updatedUser = yield addPhotosUrlsToUserAsync(user);
            let apiResponseModel = {
                data: updatedUser
            };
            console.log({ getUser: apiResponseModel });
            res.json(apiResponseModel);
        }
        catch (message) {
            console.error({ message });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: couldn't get user ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.email}` });
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
            res.json({ error: `internal error: couldn't create user` });
        }
    });
}
function updateUser(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = req.body;
            user = Object.assign(Object.assign({}, user), { email: user.cognitoUser.email });
            delete user.cognitoUser;
            console.log({ updateUser: user });
            let updatedUser = yield userRepository.updateUserByEmail(user);
            let apiResponseModel = {
                data: updatedUser
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            console.error({ message });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: couldn't update user ${(_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.id}` });
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
            res.json({ error: `internal error: couldn't delete user ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.userId}` });
        }
    });
}
function addPhotosUrlsToUserAsync(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let photoUrl = null;
        let certificateUrl = null;
        try {
            if (user === null || user === void 0 ? void 0 : user.photo) {
                photoUrl = yield s3Service.generateDownloadPresignedUrl(user.photo);
            }
            if (user === null || user === void 0 ? void 0 : user.certificate) {
                certificateUrl = yield s3Service.generateDownloadPresignedUrl(user.certificate);
            }
        }
        catch (message) {
            console.error({ message });
        }
        finally {
            return Object.assign(Object.assign({}, user), { photoUrl,
                certificateUrl });
        }
    });
}
const userRoute = Router();
userRoute.get('/:userId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getUser(req, res); next(); }));
userRoute.get('/email/:email', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getUserByEmail(req, res); next(); }));
userRoute.get('/profession/:profession', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getUsersByProfession(req, res); next(); }));
userRoute.get('/all', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getAllUsers(req, res); next(); }));
userRoute.post('/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield createUser(req, res); next(); }));
userRoute.put('/update', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield updateUser(req, res); next(); }));
userRoute.delete('/:userId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield deleteUser(req, res); next(); }));
export { userRoute };
//# sourceMappingURL=userRoute.js.map