interface CommentModel {
    id?: string,
    body?: string,
    autherId?: string,
    autherName?: string,
    issueId?: string | null,
    postId?: string | null,
    createdAt?: Date,
    updatedAt?: Date,
};

export type {CommentModel};