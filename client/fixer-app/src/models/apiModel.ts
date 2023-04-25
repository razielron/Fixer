export default interface ApiResponseModel<T> {
    data?: T,
    error?: string,
};