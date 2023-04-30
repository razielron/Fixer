import AWS from "aws-sdk";
import { randomUUID } from "crypto";
import { PresignedUrlModel } from "../models/presignedUrlModel.js";

class S3Service {
    private s3: AWS.S3;

    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
            signatureVersion: "v4",
        });
    }

    async generateUploadPresignedUrl(fileType: string): Promise<PresignedUrlModel> {
        const uploadId = randomUUID();
        const key = `${uploadId}.${fileType}`;
        const presignedUrl = await this.s3.getSignedUrlPromise('putObject', {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
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