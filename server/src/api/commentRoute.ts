import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CommentModel, UserModel } from '../models/dbModels.js';
import { commentRepository } from '../DB/commentsRepository.js';
import { userRepository } from '../DB/userRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
import { ApiResponseModel, CommentApiModel } from '../models/apiModels.js';
import { s3Service } from '../services/s3Service.js';

async function getCommentById(req: Request, res: Response): Promise<void> {
    try {
        let commentId: string = req?.params?.commentId;
        let comment: CommentModel = await commentRepository.getCommentById(commentId);
        let user: UserModel = null;

        if(comment?.autherId) {
            user = await userRepository.getUser(comment.autherId);
        }

        if (!comment || !user) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let apiResponseModel: ApiResponseModel<CommentApiModel> = {
            data: {
                ...comment,
                autherName: user?.name
            }
        };

        res.json(apiResponseModel);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get comment ${req?.params?.commentId}` });
    }
}

async function getCommentsByIssueId(req: Request, res: Response): Promise<void> {
    try {
        let issueId: string = req?.params?.issueId;
        let comments: CommentModel[] = await commentRepository.getCommentsByIssueId(issueId);
        let users: UserModel[] = [];
        
        if(comments) {
            let filteredComments: string[] = comments.map(comment => comment?.autherId).filter(item => item) as string[];
            users = await userRepository.getUsers(filteredComments);
        }

        if (!comments || !users) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let commentApiModels: CommentApiModel[] = comments.map(comment => {
            let user = users.find(user => user?.id === comment?.autherId);
            return {
                ...comment,
                autherName: user?.name
            }
        });

        res.json({data: commentApiModels});
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get comment by user ${req?.params?.userId}` });
    }
}

async function getCommentsByPostId(req: Request, res: Response): Promise<void> {
    try {
        let postId: string = req?.params?.postId;
        let comments: CommentModel[] = await commentRepository.getCommentsByPostId(postId);
        let users: any[] = [];
        
        if(comments) {
            let filteredComments: string[] = comments.map(comment => comment?.autherId).filter(item => item) as string[];
            users = await userRepository.getUsers(filteredComments);
        }

        if (!comments || !users) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        users = users?.map(async (user) => {
            if(user?.photo) {
                user.photoUrl = await s3Service.generateDownloadPresignedUrl(user?.photo);
            }
            return user;
        });

        users = await Promise.all(users);

        let commentApiModels: CommentApiModel[] = comments.map(comment => {
            let user = users.find(user => user?.id === comment?.autherId);
            return {
                ...comment,
                autherName: user?.name,
                autherPhotoUrl: user?.photoUrl,
            }
        });

        res.json({data: commentApiModels});
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get comment by user ${req?.params?.userId}` });
    }
}

async function createComment(req: Request, res: Response): Promise<void> {
    try {
        let comment: CommentModel = req.body;
        let email: string = req?.body?.cognitoUser?.email;

        if(!comment || !email) {
            res.status(StatusCodes.BAD_REQUEST);
            res.json({ error: `Missing comment data or valid token` });
            return;
        }

        let user: UserModel = await userRepository.getUserByEmail(email);
        comment.autherId = user?.id;
        await commentRepository.createComment(comment);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't create comment` });
    }
}

async function updateComment(req: Request, res: Response): Promise<void> {
    try {
        let comment: CommentModel = req.body;
        // TODO: Verify comment's autherId matches the token
        let updatedComment: CommentModel = await commentRepository.updateComment(comment);
        let apiResponseModel: ApiResponseModel<CommentModel> = {
            data: updatedComment
        }
        res.json(apiResponseModel);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't update comment ${req?.body?.id}` });
    }
}

async function deleteComment(req: Request, res: Response): Promise<void> {
    try {
        let commentId: string = req?.params?.commentId;
        // TODO: Verify comment's autherId matches the token
        let comment: CommentModel = await commentRepository.deleteComment(commentId);
        let apiResponseModel: ApiResponseModel<CommentModel> = {
            data: comment
        }
        res.json(apiResponseModel);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't delete comment ${req?.params?.commentId}` });
    }
}

const commentRoute: Router = Router();

commentRoute.get('/:commentId', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await getCommentById(req, res); next(); });
commentRoute.get('/issue/:issueId', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await getCommentsByIssueId(req, res); next(); });
commentRoute.get('/post/:postId', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await getCommentsByPostId(req, res); next(); });
commentRoute.post('/create', authenticateUser, async (req: Request<{}, {}, CommentModel>, res: Response, next: NextFunction) => { await createComment(req, res); next(); });
commentRoute.put('/update', authenticateUser, async (req: Request<{}, {}, CommentModel>, res: Response, next: NextFunction) => { await updateComment(req, res); next(); });
commentRoute.delete('/:commentId', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await deleteComment(req, res); next(); });

export {
    commentRoute
}