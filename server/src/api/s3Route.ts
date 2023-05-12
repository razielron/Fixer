import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponseModel } from '../models/apiModels.js';
import { authenticateUser } from "./apiAuthentication.js";
import { s3Service } from '../services/s3Service.js';
import { PresignedUrlModel } from '../models/presignedUrlModel.js';

interface FileModel {
    fileName: string;
    fileType: string;
}

async function generateUploadPresignedUrl(req: Request, res: Response): Promise<void> {
    try {
        let fileModel: FileModel = req?.body;
        let presignedUrl: PresignedUrlModel = await s3Service.generateUploadPresignedUrl(fileModel.fileType);
        let response: ApiResponseModel<PresignedUrlModel> = { data: presignedUrl };

        res.json(response);
    }
    catch (message: unknown) {
        console.error({message});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get upload presigned URL for S3` });
    }
}

async function generateDownloadPresignedUrl(req: Request, res: Response): Promise<void> {
    try {
        let fileModel: FileModel = req?.body;
        let presignedUrl: string = await s3Service.generateDownloadPresignedUrl(fileModel.fileName);
        let response: ApiResponseModel<string> = { data: presignedUrl };

        res.json(response);
    }
    catch (message: unknown) {
        console.error({message});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get download presigned URL for S3` });
    }
}

const s3Route: Router = Router();

s3Route.get('/upload', authenticateUser, async (req: Request<{}, {}, FileModel>, res: Response, next: NextFunction) => { await generateUploadPresignedUrl(req, res); next(); });
s3Route.get('/download', authenticateUser, async (req: Request<{}, {}, FileModel>, res: Response, next: NextFunction) => { await generateDownloadPresignedUrl(req, res); next(); });

export {
    s3Route
}