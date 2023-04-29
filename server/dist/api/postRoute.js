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
import { postRepository } from '../DB/postRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
function getPost(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let postId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.postId;
            let post = yield postRepository.getPost(postId);
            if (post === null) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            res.json(post);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ message });
        }
    });
}
function createPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let post = req.body;
            yield postRepository.createPost(post);
            res.sendStatus(StatusCodes.CREATED);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ message });
        }
    });
}
function updatePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let post = req.body;
            let updatedPost = yield postRepository.updatePost(post);
            res.json(updatedPost);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ message });
        }
    });
}
function deletePost(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let postId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.postId;
            let post = yield postRepository.deletePost(postId);
            res.json(post);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ message });
        }
    });
}
const postRoute = Router();
postRoute.get('/:postId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getPost(req, res); next(); }));
postRoute.post('/create', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield createPost(req, res); next(); }));
postRoute.put('/update', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield updatePost(req, res); next(); }));
postRoute.delete('/:postId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield deletePost(req, res); next(); }));
export { postRoute };
//# sourceMappingURL=postRoute.js.map