export enum RouterTitle {
    HOME = 'Home',
    FORUM = 'Forum',
    PROFESSIONAL = 'Professionals',
    STORE = 'Store',
};

export enum RouterPath {
    HOME = 'issues',
    FORUM = 'forum',
    PROFESSIONAL = 'professionals',
    STORE = 'store',
};

export const getRouterTitle = (path: string): RouterTitle => {
    const dictionary = {
        [RouterPath.HOME]: RouterTitle.HOME,
        [RouterPath.FORUM]: RouterTitle.FORUM,
        [RouterPath.PROFESSIONAL]: RouterTitle.PROFESSIONAL,
        [RouterPath.STORE]: RouterTitle.STORE,
    };

    return dictionary[path as RouterPath];
}