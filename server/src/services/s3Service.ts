import AWS from "aws-sdk";
import { randomUUID } from "crypto";
import { PresignedUrlModel } from "../models/presignedUrlModel.js";

class S3Service {
    private s3: AWS.S3;

    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.AWS_SESSION_TOKEN,
            region: process.env.AWS_REGION,
            signatureVersion: "v4",
        });
    }

    async generateUploadPresignedUrl(fileType: string): Promise<PresignedUrlModel> {
        const fileExtension = fileType.split('/')[1];
        const uploadId = randomUUID();
        const key = `${uploadId}.${fileExtension}`;
        const presignedUrl = await this.s3.getSignedUrlPromise('putObject', {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
            Expires: 60 * 3,
        });

        return {presignedUrl, key};
    }

    async generateDownloadPresignedUrl(key: string): Promise<string> {
        const presignedUrl = await this.s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Expires: 60 * 3,
        });

        return presignedUrl;
    }
    
    async getFile(key: string): Promise<string | null> {
        const file = await this.s3.getObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Key: key,
        }).promise();

        return file?.Body?.toString() || null;
    }
}

let s3Service: S3Service = new S3Service();

export {
    s3Service
}