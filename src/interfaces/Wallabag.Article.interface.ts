export interface IWallabagArticle {
    is_archived: 0 | 1;
    is_starred: 0 | 1;
    user_name: string;
    tags: {
        id: number;
        label: string;
        slug: string;
    }[];
    id: number;
    title: string;
    url: string;
    _links: {
        self: {
            href: string;
        };
    };
}

export interface IWallabagArticlesResponse {
    page: number;
    limit: number;
    pages: number;
    total: number;
    _links: object;
    _embedded: {
        items: IWallabagArticle[];
    };
}
