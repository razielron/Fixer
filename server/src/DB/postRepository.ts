import { PrismaClient, Post } from '@prisma/client';
import { PostModel } from '../models/dbModels.js';
import { Prisma as PrismaTypes } from '@prisma/client';

const prisma = new PrismaClient();

class PostRepository {
    public async getPost(postId : string) : Promise<PostModel> {
        let where = { id: postId };
        let post : PostModel = await prisma.post.findFirst({ where });

        return post;
    }

    public async createPost(post: PostModel) : Promise<PostModel> {
        if(this.isPostCreateInput(post)) {
            let data : PrismaTypes.PostCreateInput = post;
            let createdPost : PostModel = await prisma.post.create({ data });
            return createdPost;
        }
        
        throw new Error("Cnnot create Post. The given post is not type of PostCreateInput");
    }

    public async updatePost(post: PostModel) : Promise<PostModel> {
        if(!post?.id) {
            throw new Error("Missing id to update post");
        }

        let where = { id: post.id };
        let data : PrismaTypes.PostUncheckedUpdateInput = post;
        let updatedPost: PostModel = await prisma.post.update({where, data});

        return updatedPost;
    }

    public async deletePost(id: string) : Promise<PostModel> {
        let where = { id };
        let deletedPost = prisma.post.delete({ where });

        return deletedPost;
    }

    private isPostCreateInput(post : PostModel) : post is PrismaTypes.PostCreateInput {
        return (post?.title !== undefined
            && post?.body !== undefined)
    }
}