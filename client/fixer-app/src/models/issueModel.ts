interface IssueModel {
    id?: string,
    title?: string,
    body?: string,
    profession?: string,
    photo?: string,
    autherId?: string,
    createdAt?: Date,
    updatedAt?: Date,
};

interface GetIssuesResponse {
    data?: IssueModel[],
    message?: string,
};

export type {IssueModel, GetIssuesResponse};