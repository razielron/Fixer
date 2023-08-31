interface CardModel {
    id?: string,
    title?: string,
    body?: string,
    profession?: string,
    imageArray?: string[] | null,
    imageUrls?: string[] | null,
    autherId?: string,
    autherName?: string,
    avatarUrl?: string,
    avatar?: string,
    createdAt?: Date,
    updatedAt?: Date,
    autherPhotoUrl?:string,
};

export type {CardModel};