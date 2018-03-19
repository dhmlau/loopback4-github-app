export type GHStargazerList = {
    items: GHStargazer[],
    nextPageUrl: string,
    lastPageUrl: string,
    url: string
}

export type GHStargazer = {
    login: string //we do not care about other details of the stargazer
}