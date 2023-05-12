interface ApiResponseModel<T> {
    data?: T,
    error?: string,
};

interface PresignedUrlModel {
    key: string;
    presignedUrl: string;
}

export type { ApiResponseModel, PresignedUrlModel };