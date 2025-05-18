export interface IFreshRSSArticle {
    id: string;
    crawlTimeMsec: string;
    timestampUsec: string;
    published: number;
    title: string;
    canonical: {
        href: string;
    }[];
    alternate: {
        href: string;
    }[];
    categories: string[];
    origin: {
        streamId: string;
        htmlUrl: string;
        title: string;
    },
    summary: {
        content: string;
    },
    author: string
}

export interface IFreshRSSArticlesResponse {
    id: string;
    updated: number;
    items: IFreshRSSArticle[];
    continuation?: string;
}
