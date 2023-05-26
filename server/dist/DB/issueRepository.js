var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
import GetProfessionEnumByString from '../models/profession.js';
const prisma = new PrismaClient();
``;
class IssueRepository {
    getIssueById(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = { id: issueId };
            let issue = yield prisma.issue.findFirst({ where });
            return issue;
        });
    }
    getIssuesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = { autherId: userId };
            let issues = yield prisma.issue.findMany({ where });
            return issues;
        });
    }
    getIssuesByProfession(profession) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = { profession: GetProfessionEnumByString(profession) };
            let issues = yield prisma.issue.findMany({ where });
            return issues;
        });
    }
    createIssue(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            let issueInputModel = this.getIssueCreateInput(issue);
            if (issueInputModel != null) {
                try {
                    let data = issueInputModel;
                    let createdIssue = yield prisma.issue.create({ data });
                    return createdIssue;
                }
                catch (error) {
                    throw error;
                }
            }
            throw new Error("Cnnot create Issue. The given issue is not type of IssueCreateInput");
        });
    }
    updateIssue(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(issue === null || issue === void 0 ? void 0 : issue.id)) {
                throw new Error("Missing id to update issue");
            }
            try {
                let where = { id: issue.id };
                let data = issue;
                let updatedIssue = yield prisma.issue.update({ where, data });
                return updatedIssue;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteIssue(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { id };
                let deletedIssue = prisma.issue.delete({ where });
                return deletedIssue;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getIssueCreateInput(issue) {
        if (!(issue === null || issue === void 0 ? void 0 : issue.title) || !(issue === null || issue === void 0 ? void 0 : issue.body) || !(issue === null || issue === void 0 ? void 0 : issue.profession) || !(issue === null || issue === void 0 ? void 0 : issue.autherId)) {
            return null;
        }
        return {
            title: issue.title,
            body: issue.body,
            profession: issue.profession,
            photo: issue === null || issue === void 0 ? void 0 : issue.photo,
            auther: {
                connect: { id: issue === null || issue === void 0 ? void 0 : issue.autherId }
            }
        };
    }
}
let issueRepository = new IssueRepository();
export { issueRepository };
//# sourceMappingURL=issueRepository.js.map