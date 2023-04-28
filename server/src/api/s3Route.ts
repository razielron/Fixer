import { Router, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponseModel } from '../models/apiModels.js';
import { authenticateUser } from "./apiAuthentication.js";
import { s3Service } from '../services/s3Service.js';
import { PresignedUrlModel } from '../models/presignedUrlModel.js';

async function generatePresignedUrl(req: Request, res: Response): Promise<void> {
    try {
        let fileType: string = req?.params?.fileType;
        let presignedUrl: PresignedUrlModel = await s3Service.generatePresignedUrl(fileType);
        let response: ApiResponseModel<PresignedUrlModel> = { data: presignedUrl };

        res.json(response);
    }
    catch (message: unknown) {
        console.error({message});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: `internal error: coudn't get presigned URL for S3` });
    }
}

const s3Route: Router = Router();

s3Route.get('/presignedurl/:fileType', authenticateUser, async (req: Request, res: Response, next: NextFunction) => { await generatePresignedUrl(req, res); next(); });
export {
    s3Route
}