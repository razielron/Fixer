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
class PostRepository {
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield prisma.post.findMany();
            return post;
        });
    }
    getPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = { id: postId };
            let post = yield prisma.post.findFirst({ where });
            return post;
        });
    }
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            let postInputModel = this.getPostCreateInput(post);
            if (postInputModel) {
                try {
                    let data = postInputModel;
                    let createdPost = yield prisma.post.create({ data });
                    return createdPost;
                }
                catch (error) {
                    throw error;
                }
            }
            throw new Error("Cnnot create Post. The given post is not type of PostCreateInput");
        });
    }
    updatePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(post === null || post === void 0 ? void 0 : post.id)) {
                throw new Error("Missing id to update post");
            }
            try {
                let where = { id: post.id };
                let data = post;
                let updatedPost = yield prisma.post.update({ where, data });
                return updatedPost;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { id };
                let deletedPost = prisma.post.delete({ where });
                return deletedPost;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPostCreateInput(post) {
        if (!(post === null || post === void 0 ? void 0 : post.title) || !(post === null || post === void 0 ? void 0 : post.body) || !(post === null || post === void 0 ? void 0 : post.autherId)) {
            return null;
        }
        return {
            title: post.title,
            body: post.body,
            photo: post === null || post === void 0 ? void 0 : post.photo,
            auther: {
                connect: { id: post === null || post === void 0 ? void 0 : post.autherId }
            }
        };
    }
}
let postRepository = new PostRepository();
export { postRepository };
//# sourceMappingURL=postRepository.js.map