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
class CommentRepository {
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { id: commentId };
                let comment = yield prisma.comment.findFirst({ where });
                return comment;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    getCommentsByIssueId(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { issueId: issueId };
                let comments = yield prisma.comment.findMany({ where });
                return comments;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            let commentInputModel = this.getCommentCreateInput(comment);
            if (!commentInputModel) {
                throw new Error("Cnnot create Comment. The given comment is not type of CommentCreateInput");
            }
            try {
                let data = commentInputModel;
                let createdComment = yield prisma.comment.create({ data });
                return createdComment;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    updateComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(comment === null || comment === void 0 ? void 0 : comment.id)) {
                throw new Error("Missing id to update comment");
            }
            try {
                let where = { id: comment.id };
                let data = comment;
                let updatedComment = yield prisma.comment.update({ where, data });
                return updatedComment;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { id };
                let deletedComment = prisma.comment.delete({ where });
                return deletedComment;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    getCommentCreateInput(comment) {
        if (!(comment === null || comment === void 0 ? void 0 : comment.body) || !(comment === null || comment === void 0 ? void 0 : comment.autherId)) {
            return null;
        }
        let commentCreateInput = {
            body: comment.body,
            auther: {
                connect: { id: comment.autherId }
            }
        };
        if (comment === null || comment === void 0 ? void 0 : comment.issueId) {
            return Object.assign(Object.assign({}, commentCreateInput), { issue: {
                    connect: { id: comment.issueId }
                } });
        }
        if (comment === null || comment === void 0 ? void 0 : comment.postId) {
            return Object.assign(Object.assign({}, commentCreateInput), { post: {
                    connect: { id: comment.postId }
                } });
        }
        return null;
    }
}
let commentRepository = new CommentRepository();
export { commentRepository };
//# sourceMappingURL=commentsRepository.js.map