interface ApiResponseModel<T> {
    data?: T;
    error?: string;
}

interface IssueApiModel {
    id?: string;
    title?: string;
    body?: string;
    profession?: string;
    photo?: string | null;
    photoUrl?: string | null;
    autherId?: string;
    autherName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface PostApiModel {
    id?: string;
    title?: string;
    body?: string;
    photo?: string | null;
    photoUrl?: string | null;
    autherId?: string;
    autherName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface CommentApiModel {
    id?: string;
    body?: string;
    autherId?: string;
    autherName?: string;
    issueId?: string | null;
    postId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface PriceOfferApiModel {
    id?: string;
    body?: string;
    price?: Number;
    photo?: string | null;
    photoUrl?: string | null;
    autherId?: string;
    autherName?: string;
    issurId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type { ApiResponseModel, IssueApiModel, PostApiModel, CommentApiModel, PriceOfferApiModel };