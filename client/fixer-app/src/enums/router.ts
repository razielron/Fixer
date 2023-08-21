export enum RouterTitle {
    HOME = 'Home',
    FORUM = 'Forum',
    PROFESSIONAL = 'Professionals'
};

export enum RouterPath {
    HOME = 'issues',
    FORUM = 'forum',
    PROFESSIONAL = 'professionals'
};

export const getRouterTitle = (path: string): RouterTitle => {
    const dictionary = {
        [RouterPath.HOME]: RouterTitle.HOME,
        [RouterPath.FORUM]: RouterTitle.FORUM,
        [RouterPath.PROFESSIONAL]: RouterTitle.PROFESSIONAL,
    };

    return dictionary[path as RouterPath];
}