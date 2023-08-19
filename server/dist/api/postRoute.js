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
import { userRepository } from '../DB/userRepository.js';
import { s3Service } from '../services/s3Service.js';
function getAllPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let posts = yield postRepository.getAllPosts();
            let users = [];
            if (posts) {
                let filteredIssues = posts.map(post => post === null || post === void 0 ? void 0 : post.autherId).filter(item => item);
                users = yield userRepository.getUsers(filteredIssues);
            }
            if (!posts || !users) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let postApiModels = yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                let user = users.find(user => (user === null || user === void 0 ? void 0 : user.id) === (post === null || post === void 0 ? void 0 : post.autherId));
                let photoUrl = null;
                if (post === null || post === void 0 ? void 0 : post.photo) {
                    photoUrl = yield s3Service.generateDownloadPresignedUrl(post === null || post === void 0 ? void 0 : post.photo);
                }
                return Object.assign(Object.assign({}, post), { autherName: user === null || user === void 0 ? void 0 : user.name, photoUrl });
            })));
            res.json({ data: postApiModels });
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ message });
        }
    });
}
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
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let post = req.body;
            let email = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.cognitoUser) === null || _b === void 0 ? void 0 : _b.email;
            if (!post || !email) {
                res.status(StatusCodes.BAD_REQUEST);
                res.json({ error: `Missing post data or valid token` });
                return;
            }
            let user = yield userRepository.getUserByEmail(email);
            post.autherId = user === null || user === void 0 ? void 0 : user.id;
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
postRoute.get('/', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getAllPosts(req, res); next(); }));
postRoute.get('/:postId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getPost(req, res); next(); }));
postRoute.post('/create', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield createPost(req, res); next(); }));
postRoute.put('/update', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield updatePost(req, res); next(); }));
postRoute.delete('/:postId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield deletePost(req, res); next(); }));
export { postRoute };
//# sourceMappingURL=postRoute.js.map