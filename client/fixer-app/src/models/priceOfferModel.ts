interface PriceOfferModel {
    id?: string,
    body?: string;
    price?: Number;
    autherId?: string,
    autherName?: string,
    issueId?: string | null,
    createdAt?: Date,
    updatedAt?: Date,
    imageUrls?: string[] | null,
    images?: string[] | null,
};

export type {PriceOfferModel};