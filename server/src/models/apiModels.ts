export interface IssueApiModel {
    id?: string;
    title?: string;
    body?: string;
    profession?: string;
    photo?: string | null;
    autherId?: string;
    autherName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}