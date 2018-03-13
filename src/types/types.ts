
export type GHStargazerList = {
    items: GHStargazer[],
    nextPageUrl: string,
    lastPageUrl: string,
    url: string
}

export type GHStargazer = {
    login: string
}