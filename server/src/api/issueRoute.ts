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

        if (!issue) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        issue = await getIssueModelWithS3Photos(issue);
        let apiResponseModel: IssueApiModel = convertIssueToIssueApiModel(issue);

        res.json({ data: apiResponseModel });
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get issue ${req?.params?.issueId}` });
    }
}

async function getIssuesByUserId(req: Request, res: Response): Promise<void> {
    try {
        let userId: string = req?.params?.userId;
        let issues: IssueModel[] = await issueRepository.getIssuesByUserId(userId);

        if (!issues) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let getPhotosFromS3Promises = issues.map(issue => {
            return getIssueModelWithS3Photos(issue);
        });

        issues = await Promise.all(getPhotosFromS3Promises);

        let issueApiModels: IssueApiModel[] = issues.map(issue => {
            return convertIssueToIssueApiModel(issue);
        });

        res.json({data: issueApiModels});
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get issue by user ${req?.params?.userId}` });
    }
}

async function getIssuesByProfession(req: Request, res: Response): Promise<void> {
    try {
        let profession: string = req?.params?.profession;
        let issues: IssueModel[] = await issueRepository.getIssuesByProfession(profession);

        if (!issues) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        let getPhotosFromS3Promises = issues.map(issue => {
            return getIssueModelWithS3Photos(issue);
        });

        issues = await Promise.all(getPhotosFromS3Promises);

        let issueApiModels: IssueApiModel[] = issues.map(issue => {
            return convertIssueToIssueApiModel(issue);
        });

        res.json({data: issueApiModels});
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get issue by profession ${req?.params?.profession}` });
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
        res.json({ error: `internal error: coudn't create issue` });
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
        res.json({ error: `internal error: coudn't update issue ${req?.body?.id}` });
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
        res.json({ error: `internal error: coudn't delete issue ${req?.params?.issueId}` });
    }
}

async function getIssueModelWithS3Photos(issue: IssueModel): Promise<IssueModel> {
    if(issue?.photos) {
        let getPhotosFromS3Promises = issue?.photos?.map(async photo => {
            let s3photo = await s3Service.generateDownloadPresignedUrl(photo.url as string);
            photo.url = s3photo;
            return photo;
        });

        issue.photos = await Promise.all(getPhotosFromS3Promises);
    }

    return issue;
}

function convertIssueToIssueApiModel(issue: IssueModel): IssueApiModel {
    return {
        id: issue?.id,
        title: issue?.title,
        body: issue?.body,
        profession: issue?.profession,
        photos: issue?.photos?.map(photo => photo?.url).filter(item => item !== null) as string[],
        autherName: issue?.auther?.name,
        createdAt: issue?.createdAt,
        updatedAt: issue?.updatedAt
    };
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