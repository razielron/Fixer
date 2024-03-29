import { PrismaClient, Post } from '@prisma/client';
import { PostModel } from '../models/dbModels.js';
import { Prisma as PrismaTypes } from '@prisma/client';

const prisma = new PrismaClient();

class PostRepository {
    public async getAllPosts() : Promise<PostModel[]> {
        let post : PostModel[] = await prisma.post.findMany();

        return post;
    }

    public async getPost(postId : string) : Promise<PostModel> {
        let where = { id: postId };
        let post : PostModel = await prisma.post.findFirst({ where });

        return post;
    }

    public async createPost(post: PostModel) : Promise<PostModel> {
        let postInputModel : PrismaTypes.PostCreateInput | null = this.getPostCreateInput(post);

        if(postInputModel) {
            try {
                let data : PrismaTypes.PostCreateInput = postInputModel;
                let createdPost : PostModel = await prisma.post.create({ data });
                return createdPost;
            }
            catch(error : unknown) {
                throw error;
            }
        }
        
        throw new Error("Cnnot create Post. The given post is not type of PostCreateInput");
    }

    public async updatePost(post: PostModel) : Promise<PostModel> {
        if(!post?.id) {
            throw new Error("Missing id to update post");
        }

        try {
            let where = { id: post.id };
            let data : PrismaTypes.PostUncheckedUpdateInput = post;
            let updatedPost: PostModel = await prisma.post.update({where, data});

            return updatedPost;
        }
        catch(error : unknown) {
            throw error;
        }
    }

    public async deletePost(id: string) : Promise<PostModel> {
        try {
            let where = { id };
            let deletedPost = prisma.post.delete({ where });

            return deletedPost;
        }
        catch(error : unknown) {
            throw error;
        }
    }

    private getPostCreateInput(post: PostModel): PrismaTypes.PostCreateInput | null {
        if(!post?.title || !post?.body || !post?.autherId) {
            return null;
        }

        return {
            title: post.title,
            body: post.body,
            photo: post?.photo,
            auther: {
                connect: { id: post?.autherId }
            }
        };
    }
}

let postRepository : PostRepository = new PostRepository();

export {
    postRepository
}