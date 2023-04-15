import { PrismaClient, Issue, Profession } from '@prisma/client';
import { IssueModel } from '../models/dbModels.js';
import { Prisma as PrismaTypes } from '@prisma/client';

const prisma = new PrismaClient();

class IssueRepository {
    public async getIssueById(issueId: string): Promise<IssueModel> {
        let where = { id: issueId };
        let issue: IssueModel = await prisma.issue.findFirst({ where });

        return issue;
    }

    public async getIssuesByUserId(userId: string): Promise<IssueModel[]> {
        let where = { autherId: userId };
        let issues: IssueModel[] = await prisma.issue.findMany({ where });

        return issues;
    }

    public async getIssuesByProfession(profession: string): Promise<IssueModel[]> {
        if (!Object.values(Profession).includes(profession as unknown as Profession)) {
            throw new Error("Profession not exist in ENUM");
        }
        
        let where = { profession: profession as Profession };
        let issues: IssueModel[] = await prisma.issue.findMany({ where });

        return issues;
    }

    public async createIssue(issue: IssueModel): Promise<IssueModel> {
        let issueInputModel : PrismaTypes.IssueCreateInput | null = this.getIssueCreateInput(issue);

        if (issueInputModel != null) {
            try {
                let data: PrismaTypes.IssueCreateInput = issueInputModel;
                let createdIssue: IssueModel = await prisma.issue.create({ data });
                return createdIssue;
            }
            catch (error: unknown) {
                throw error;
            }
        }

        throw new Error("Cnnot create Issue. The given issue is not type of IssueCreateInput");
    }

    public async updateIssue(issue: IssueModel): Promise<IssueModel> {
        if (!issue?.id) {
            throw new Error("Missing id to update issue");
        }

        try {
            let where = { id: issue.id };
            let data: PrismaTypes.IssueUncheckedUpdateInput = issue;
            let updatedIssue: IssueModel = await prisma.issue.update({ where, data });

            return updatedIssue;
        }
        catch (error: unknown) {
            throw error;
        }
    }

    public async deleteIssue(id: string): Promise<IssueModel> {
        try {
            let where = { id };
            let deletedIssue = prisma.issue.delete({ where });

            return deletedIssue;
        }
        catch (error: unknown) {
            throw error;
        }
    }

    private getIssueCreateInput(issue: IssueModel): PrismaTypes.IssueCreateInput | null {
        if(!issue?.title || !issue?.body || !issue?.profession || !issue?.autherId) {
            return null;
        }

        return {
            title: issue.title,
            body: issue.body,
            profession: issue.profession,
            auther: {
                connect: { id: issue?.autherId }
            }
        };
    }
}

let issueRepository: IssueRepository = new IssueRepository();

export {
    issueRepository
}