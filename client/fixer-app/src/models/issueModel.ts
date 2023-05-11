interface IssueModel {
    id?: string,
    title?: string,
    body?: string,
    profession?: string,
    photo?: string,
    autherId?: string,
    autherName?: string,
    createdAt?: Date,
    updatedAt?: Date,
};

export type {IssueModel};