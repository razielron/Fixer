import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IssueModel } from '../models/dbModels.js';
import { issueRepository } from '../DB/issueRepository.js';
import { authenticateUser } from "./apiAuthentication.js";

async function getIssueById(req: Request, res: Response): Promise<void> {
    try {
        let issueId: string = req?.params?.issueId;
        let issue: IssueModel = await issueRepository.getIssueById(issueId);

        if (issue === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        res.json(issue);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ message });
    }
}

async function getIssuesByUserId(req: Request, res: Response): Promise<void> {
    try {
        let userId: string = req?.params?.userId;
        let issue: IssueModel[] = await issueRepository.getIssuesByUserId(userId);

        if (issue === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        res.json(issue);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ message });
    }
}

async function getIssuesByProfession(req: Request, res: Response): Promise<void> {
    try {
        let profession: string = req?.params?.profession;
        let issue: IssueModel[] = await issueRepository.getIssuesByProfession(profession);

        if (issue === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        res.json(issue);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ message });
    }
}

async function createIssue(req: Request, res: Response): Promise<void> {
    try {
        let issue: IssueModel = req.body;
        await issueRepository.createIssue(issue);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ message });
    }
}

async function updateIssue(req: Request, res: Response): Promise<void> {
    try {
        let issue: IssueModel = req.body;
        let updatedIssue = await issueRepository.updateIssue(issue);
        res.json(updatedIssue);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ message });
    }
}

async function deleteIssue(req: Request, res: Response): Promise<void> {
    try {
        let issueId: string = req?.params?.issueId;
        let issue: IssueModel = await issueRepository.deleteIssue(issueId);
        res.json(issue);
    }
    catch (message: unknown) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ message });
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