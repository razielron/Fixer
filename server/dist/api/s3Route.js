var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authenticateUser } from "./apiAuthentication.js";
import { s3Service } from '../services/s3Service.js';
function generateUploadPresignedUrl(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let fileType = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.fileType;
            let presignedUrl = yield s3Service.generateUploadPresignedUrl(fileType);
            let response = { data: presignedUrl };
            res.json(response);
        }
        catch (message) {
            console.error({ message });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't get upload presigned URL for S3` });
        }
    });
}
function generateDownloadPresignedUrl(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let fileName = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.fileName;
            let presignedUrl = yield s3Service.generateDownloadPresignedUrl(fileName);
            let response = { data: presignedUrl };
            res.json(response);
        }
        catch (message) {
            console.error({ message });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't get download presigned URL for S3` });
        }
    });
}
const s3Route = Router();
s3Route.get('/upload/:fileType', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield generateUploadPresignedUrl(req, res); next(); }));
s3Route.get('/download/:fileName', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield generateDownloadPresignedUrl(req, res); next(); }));
export { s3Route };
//# sourceMappingURL=s3Route.js.map