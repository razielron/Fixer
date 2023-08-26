import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IssueModel, UserModel } from '../models/dbModels.js';
import { issueRepository } from '../DB/issueRepository.js';
import { userRepository } from '../DB/userRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
import { ApiResponseModel, IssueApiModel } from '../models/apiModels.js';
import { s3Service } from '../services/s3Service.js';

async function getIssueById(req: Request, res: Response): Promise<void> {
    try {
        let issueId: string = req?.params?.issueId;
        let issue: IssueModel = await issueRepository.getIssueById(issueId);
        let user: UserModel = null;

        if(issue?.autherId) {
            user = await userRepository.getUser(issue.autherId);
        }

        if (!issue || !user) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let apiResponseModel: ApiResponseModel<IssueApiModel> = {
            data: {
                ...issue,
                autherName: user?.name
            }
        };

        res.json(apiResponseModel);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: couldn't get issue ${req?.params?.issueId}` });
    }
}

async function getIssuesByUserId(req: Request, res: Response): Promise<void> {
    try {
        let userId: string = req?.params?.userId;
        let issues: IssueModel[] = await issueRepository.getIssuesByUserId(userId);
        let users: UserModel[] = [];
        
        if(issues) {
            let filteredIssues: string[] = issues.map(issue => issue?.autherId).filter(item => item) as string[];
            users = await userRepository.getUsers(filteredIssues);
        }

        if (!issues || !users) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let issueApiModels: IssueApiModel[] = issues.map(issue => {
            let user = users.find(user => user?.id === issue?.autherId);
            return {
                ...issue,
                autherName: user?.name,
            }
        });

        res.json({data: issueApiModels});
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: couldn't get issue by user ${req?.params?.userId}` });
    }
}

async function getIssuesByProfession(req: Request, res: Response): Promise<void> {
    try {
        let profession: string = req?.params?.profession;
        let issues: IssueModel[] = await issueRepository.getIssuesByProfession(profession);
        let users: UserModel[] = [];
        
        if(issues) {
            let filteredIssues: string[] = issues.map(issue => issue?.autherId).filter(item => item) as string[];
            users = await userRepository.getUsers(filteredIssues);
        }

        if (!issues || !users) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let issueApiModels: IssueApiModel[] = await Promise.all(issues.map(async (issue) => {
            let user = users.find(user => user?.id === issue?.autherId);
            let photoUrlTask;
            let autherPhotoUrlTask;
            
            if(issue?.photo) {
                photoUrlTask = s3Service.generateDownloadPresignedUrl(issue?.photo);
            }

            if(user?.photo) {
                autherPhotoUrlTask = s3Service.generateDownloadPresignedUrl(user?.photo);
            }

            let [photoUrl, autherPhotoUrl] = await Promise.all([photoUrlTask, autherPhotoUrlTask]);

            return {
                ...issue,
                autherName: user?.name,
                photoUrl,
                autherPhotoUrl
            }
        }));

        res.json({data: issueApiModels});
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: couldn't get issue by profession ${req?.params?.profession}` });
    }
}

async function createIssue(req: Request, res: Response): Promise<void> {
    try {
        let issue: IssueModel = req.body;
        let email: string = req?.body?.cognitoUser?.email;

        if(!issue || !email) {
            res.status(StatusCodes.BAD_REQUEST);
            res.json({ error: `Missing issue data or valid token` });
            return;
        }

        let user: UserModel = await userRepository.getUserByEmail(email);
        issue.autherId = user?.id;
        await issueRepository.createIssue(issue);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: couldn't create issue` });
    }
}

async function updateIssue(req: Request, res: Response): Promise<void> {
    try {
        let issue: IssueModel = req.body;
        let updatedIssue: IssueModel = await issueRepository.updateIssue(issue);
        let apiResponseModel: ApiResponseModel<IssueModel> = {
            data: updatedIssue
        }
        res.json(apiResponseModel);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: couldn't update issue ${req?.body?.id}` });
    }
}

async function deleteIssue(req: Request, res: Response): Promise<void> {
    try {
        let issueId: string = req?.params?.issueId;
        let issue: IssueModel = await issueRepository.deleteIssue(issueId);
        let apiResponseModel: ApiResponseModel<IssueModel> = {
            data: issue
        }
        res.json(apiResponseModel);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: couldn't delete issue ${req?.params?.issueId}` });
    }
}

const issueRoute: Router = Router();

issueRoute.get('/:issueId', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await getIssueById(req, res); next(); });
issueRoute.get('/user/:userId', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await getIssuesByUserId(req, res); next(); });
issueRoute.get('/profession/:profession', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await getIssuesByProfession(req, res); next(); });
issueRoute.post('/create', authenticateUser, async (req: Request<{}, {}, IssueModel>, res: Response, next: NextFunction) => { await createIssue(req, res); next(); });
issueRoute.put('/update', authenticateUser, async (req: Request<{}, {}, IssueModel>, res: Response, next: NextFunction) => { await updateIssue(req, res); next(); });
issueRoute.delete('/:issueId', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await deleteIssue(req, res); next(); });

export {
    issueRoute
}