interface CommentModel {
    id?: string,
    body?: string,
    autherId?: string,
    autherName?: string,
    issueId?: string | null,
    postId?: string | null,
    createdAt?: Date,
    updatedAt?: Date,
    imageUrls?: string[] | null,
    images?: string[] | null,
    autherPhotoUrl?: string | null,
    avatar?: string | null,
};

export type {CommentModel};