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
import { issueRepository } from '../DB/issueRepository.js';
import { userRepository } from '../DB/userRepository.js';
import { authenticateUser } from "./apiAuthentication.js";
import { s3Service } from '../services/s3Service.js';
function getIssueById(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let issueId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.issueId;
            let issue = yield issueRepository.getIssueById(issueId);
            if (!issue) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            issue = yield getIssueModelWithS3Photos(issue);
            let apiResponseModel = convertIssueToIssueApiModel(issue);
            res.json({ data: apiResponseModel });
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't get issue ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.issueId}` });
        }
    });
}
function getIssuesByUserId(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.userId;
            let issues = yield issueRepository.getIssuesByUserId(userId);
            if (!issues) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let getPhotosFromS3Promises = issues.map(issue => {
                return getIssueModelWithS3Photos(issue);
            });
            issues = yield Promise.all(getPhotosFromS3Promises);
            let issueApiModels = issues.map(issue => {
                return convertIssueToIssueApiModel(issue);
            });
            res.json({ data: issueApiModels });
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't get issue by user ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.userId}` });
        }
    });
}
function getIssuesByProfession(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let profession = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.profession;
            let issues = yield issueRepository.getIssuesByProfession(profession);
            if (!issues) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            let getPhotosFromS3Promises = issues.map(issue => {
                return getIssueModelWithS3Photos(issue);
            });
            issues = yield Promise.all(getPhotosFromS3Promises);
            let issueApiModels = issues.map(issue => {
                return convertIssueToIssueApiModel(issue);
            });
            res.json({ data: issueApiModels });
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't get issue by profession ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.profession}` });
        }
    });
}
function createIssue(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let issue = req.body;
            let email = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.cognitoUser) === null || _b === void 0 ? void 0 : _b.email;
            if (!issue || !email) {
                res.status(StatusCodes.BAD_REQUEST);
                res.json({ error: `Missing issue data or valid token` });
                return;
            }
            let user = yield userRepository.getUserByEmail(email);
            issue.autherId = user === null || user === void 0 ? void 0 : user.id;
            yield issueRepository.createIssue(issue);
            res.sendStatus(StatusCodes.CREATED);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't create issue` });
        }
    });
}
function updateIssue(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let issue = req.body;
            let updatedIssue = yield issueRepository.updateIssue(issue);
            let apiResponseModel = {
                data: updatedIssue
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't update issue ${(_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.id}` });
        }
    });
}
function deleteIssue(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let issueId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.issueId;
            let issue = yield issueRepository.deleteIssue(issueId);
            let apiResponseModel = {
                data: issue
            };
            res.json(apiResponseModel);
        }
        catch (message) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            res.json({ error: `internal error: coudn't delete issue ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.issueId}` });
        }
    });
}
function getIssueModelWithS3Photos(issue) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (issue === null || issue === void 0 ? void 0 : issue.photos) {
            let getPhotosFromS3Promises = (_a = issue === null || issue === void 0 ? void 0 : issue.photos) === null || _a === void 0 ? void 0 : _a.map((photo) => __awaiter(this, void 0, void 0, function* () {
                let s3photo = yield s3Service.generateDownloadPresignedUrl(photo.url);
                photo.url = s3photo;
                return photo;
            }));
            issue.photos = yield Promise.all(getPhotosFromS3Promises);
        }
        return issue;
    });
}
function convertIssueToIssueApiModel(issue) {
    var _a, _b;
    return {
        id: issue === null || issue === void 0 ? void 0 : issue.id,
        title: issue === null || issue === void 0 ? void 0 : issue.title,
        body: issue === null || issue === void 0 ? void 0 : issue.body,
        profession: issue === null || issue === void 0 ? void 0 : issue.profession,
        photos: (_a = issue === null || issue === void 0 ? void 0 : issue.photos) === null || _a === void 0 ? void 0 : _a.map(photo => photo === null || photo === void 0 ? void 0 : photo.url).filter(item => item !== null),
        autherName: (_b = issue === null || issue === void 0 ? void 0 : issue.auther) === null || _b === void 0 ? void 0 : _b.name,
        createdAt: issue === null || issue === void 0 ? void 0 : issue.createdAt,
        updatedAt: issue === null || issue === void 0 ? void 0 : issue.updatedAt
    };
}
const issueRoute = Router();
issueRoute.get('/:issueId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getIssueById(req, res); next(); }));
issueRoute.get('/user/:userId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getIssuesByUserId(req, res); next(); }));
issueRoute.get('/profession/:profession', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield getIssuesByProfession(req, res); next(); }));
issueRoute.post('/create', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield createIssue(req, res); next(); }));
issueRoute.put('/update', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield updateIssue(req, res); next(); }));
issueRoute.delete('/:issueId', authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { yield deleteIssue(req, res); next(); }));
export { issueRoute };
//# sourceMappingURL=issueRoute.js.map