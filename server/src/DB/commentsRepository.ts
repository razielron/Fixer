import { PrismaClient } from '@prisma/client';
import { CommentModel } from '../models/dbModels.js';
import { Prisma as PrismaTypes } from '@prisma/client';

const prisma = new PrismaClient();

class CommentRepository {
    public async getCommentById(commentId: string): Promise<CommentModel> {
        try {
            let where = { id: commentId };
            let comment: CommentModel = await prisma.comment.findFirst({ where });

            return comment;
        }
        catch(error: any) {
            console.log({error});
            throw error;
        }
    }

    public async getCommentsByIssueId(issueId: string): Promise<CommentModel[]> {
        try {
            let where = { issueId: issueId };
            let comments: CommentModel[] = await prisma.comment.findMany({ where });

            return comments;
        }
        catch(error: any) {
            console.log({error});
            throw error;
        }
    }

    public async getCommentsByPostId(postId: string): Promise<CommentModel[]> {
        try {
            let where = { postId: postId };
            let comments: CommentModel[] = await prisma.comment.findMany({ where });

            return comments;
        }
        catch(error: any) {
            console.log({error});
            throw error;
        }
    }

    public async createComment(comment: CommentModel): Promise<CommentModel> {
        let commentInputModel : PrismaTypes.CommentCreateInput | null = this.getCommentCreateInput(comment);
        
        if (!commentInputModel) {
            throw new Error("Cnnot create Comment. The given comment is not type of CommentCreateInput");
        }

        try {
            let data: PrismaTypes.CommentCreateInput = commentInputModel;
            let createdComment: CommentModel = await prisma.comment.create({ data });
            return createdComment;
        }
        catch (error: unknown) {
            console.log({error});
            throw error;
        }
    }

    public async updateComment(comment: CommentModel): Promise<CommentModel> {
        if (!comment?.id) {
            throw new Error("Missing id to update comment");
        }

        try {
            let where = { id: comment.id };
            let data: PrismaTypes.CommentUncheckedUpdateInput = comment;
            let updatedComment: CommentModel = await prisma.comment.update({ where, data });

            return updatedComment;
        }
        catch (error: unknown) {
            console.log({error});
            throw error;
        }
    }

    public async deleteComment(id: string): Promise<CommentModel> {
        try {
            let where = { id };
            let deletedComment = prisma.comment.delete({ where });

            return deletedComment;
        }
        catch (error: unknown) {
            console.log({error});
            throw error;
        }
    }

    private getCommentCreateInput(comment: CommentModel): PrismaTypes.CommentCreateInput | null {
        if(!comment?.body || !comment?.autherId) {
            return null;
        }

        let commentCreateInput: PrismaTypes.CommentCreateInput = {
            body: comment.body,
            auther: {
                connect: { id: comment.autherId }
            }
        }

        if(comment?.issueId) {
            return {
                ...commentCreateInput,
                issue: {
                    connect: { id: comment.issueId }
                }
            }
        }

        if(comment?.postId) {
            return {
                ...commentCreateInput,
                post: {
                    connect: { id: comment.postId }
                }
            }
        }

        return null;
    }
}

let commentRepository: CommentRepository = new CommentRepository();

export {
    commentRepository
}