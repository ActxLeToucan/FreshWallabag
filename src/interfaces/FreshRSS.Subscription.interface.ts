export interface IFreshRSSSubscription {
    id: string;
    title: string;
    categories: object[];
    url: string;
    htmlUrl: string;
    iconUrl: string;
}

export interface IFreshRSSSubscriptionsResponse {
    subscriptions: IFreshRSSSubscription[];
}
