var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { S3 } from "aws-sdk";
import { randomUUID } from "crypto";
class S3Service {
    constructor() {
        this.s3 = new S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
            signatureVersion: "v4",
        });
    }
    generatePresignedUrl(fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadId = randomUUID();
            const key = `${uploadId}.${fileType}`;
            const presignedUrl = yield this.s3.getSignedUrlPromise('putObject', {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
                Expires: 60 * 3,
            });
            return { presignedUrl, key };
        });
    }
    getFile(key) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.s3.getObject({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
            }).promise();
            return ((_a = file === null || file === void 0 ? void 0 : file.Body) === null || _a === void 0 ? void 0 : _a.toString()) || null;
        });
    }
}
let s3Service = new S3Service();
export { s3Service };
//# sourceMappingURL=s3Service.js.map