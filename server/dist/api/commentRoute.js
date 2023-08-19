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
import { commentRepository } from '../DB/commentsRepository.js';
import { userRepository } from '../DB/userRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
function getCommentById(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let commentId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.commentId;
            let comment = yield commentRepository.getCommentById(commentId);
            let user = null;
            if (comment === null || comment === void 0 ? void 0 : comment.autherId) {
                user = yield userRepository.getUser(comment.autherId);
            }
            if (!comment || !user) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let apiResponseModel = {
                data: Object.assign(Object.assign({}, comment), { autherName: user === null || user === void 0 ? void 0 : user.name })
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't get comment ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.commentId}` });
        }
    });
}
function getCommentsByIssueId(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let issueId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.issueId;
            let comments = yield commentRepository.getCommentsByIssueId(issueId);
            let users = [];
            if (comments) {
                let filteredComments = comments.map(comment => comment === null || comment === void 0 ? void 0 : comment.autherId).filter(item => item);
                users = yield userRepository.getUsers(filteredComments);
            }
            if (!comments || !users) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let commentApiModels = comments.map(comment => {
                let user = users.find(user => (user === null || user === void 0 ? void 0 : user.id) === (comment === null || comment === void 0 ? void 0 : comment.autherId));
                return Object.assign(Object.assign({}, comment), { autherName: user === null || user === void 0 ? void 0 : user.name });
            });
            res.json({ data: commentApiModels });
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't get comment by user ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.userId}` });
        }
    });
}
function getCommentsByPostId(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let postId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.postId;
            let comments = yield commentRepository.getCommentsByIssueId(postId);
            let users = [];
            if (comments) {
                let filteredComments = comments.map(comment => comment === null || comment === void 0 ? void 0 : comment.autherId).filter(item => item);
                users = yield userRepository.getUsers(filteredComments);
            }
            if (!comments || !users) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let commentApiModels = comments.map(comment => {
                let user = users.find(user => (user === null || user === void 0 ? void 0 : user.id) === (comment === null || comment === void 0 ? void 0 : comment.autherId));
                return Object.assign(Object.assign({}, comment), { autherName: user === null || user === void 0 ? void 0 : user.name });
            });
            res.json({ data: commentApiModels });
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't get comment by user ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.userId}` });
        }
    });
}
function createComment(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let comment = req.body;
            let email = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.cognitoUser) === null || _b === void 0 ? void 0 : _b.email;
            if (!comment || !email) {
                res.status(StatusCodes.BAD_REQUEST);
                res.json({ error: `Missing comment data or valid token` });
                return;
            }
            let user = yield userRepository.getUserByEmail(email);
            comment.autherId = user === null || user === void 0 ? void 0 : user.id;
            yield commentRepository.createComment(comment);
            res.sendStatus(StatusCodes.CREATED);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't create comment` });
        }
    });
}
function updateComment(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let comment = req.body;
            // TODO: Verify comment's autherId matches the token
            let updatedComment = yield commentRepository.updateComment(comment);
            let apiResponseModel = {
                data: updatedComment
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't update comment ${(_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.id}` });
        }
    });
}
function deleteComment(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let commentId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.commentId;
            // TODO: Verify comment's autherId matches the token
            let comment = yield commentRepository.deleteComment(commentId);
            let apiResponseModel = {
                data: comment
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't delete comment ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.commentId}` });
        }
    });
}
const commentRoute = Router();
commentRoute.get('/:commentId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getCommentById(req, res); next(); }));
commentRoute.get('/issue/:issueId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getCommentsByIssueId(req, res); next(); }));
commentRoute.get('/post/:postId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getCommentsByIssueId(req, res); next(); }));
commentRoute.post('/create', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield createComment(req, res); next(); }));
commentRoute.put('/update', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield updateComment(req, res); next(); }));
commentRoute.delete('/:commentId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield deleteComment(req, res); next(); }));
export { commentRoute };
//# sourceMappingURL=commentRoute.js.map