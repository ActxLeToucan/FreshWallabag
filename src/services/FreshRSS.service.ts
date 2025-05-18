import { FRESHRSS_GREADER_API_URL } from '@/config';
import { IFreshRSSSubscriptionsResponse } from '@/interfaces/FreshRSS.Subscription.interface';
import { IFreshRSSArticle, IFreshRSSArticlesResponse } from '@/interfaces/FreshRSS.Article.interface';
import { logger } from '@/utils/logger';
import axios from 'axios';
import { normalizeTitle } from '@/utils/normalizing';

class FreshRSSService {
    private auth: string | null = null;

    public async login (email: string, password: string): Promise<void> {
        const url = new URL(FRESHRSS_GREADER_API_URL);
        url.pathname += '/accounts/ClientLogin';

        const formData = new FormData();
        formData.append('Email', email);
        formData.append('Passwd', password);

        return axios.post(url.toString(), formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => {
            const match = res.data.match(/Auth=(.*)/);
            if (!match) {
                throw new Error('No auth token found');
            }

            this.auth = `GoogleLogin auth=${match[1]}`;
        }).catch((err) => {
            logger.error('Error logging in:', err);
            throw err;
        });
    };

    public async getSubscriptions (): Promise<IFreshRSSSubscriptionsResponse> {
        if (!this.auth) {
            throw new Error('Not logged in');
        }

        const url = new URL(FRESHRSS_GREADER_API_URL);
        url.pathname += '/reader/api/0/subscription/list';
        url.searchParams.append('output', 'json');

        return axios.get(url.toString(), {
            headers: {
                Authorization: this.auth
            }
        }).then((res) => {
            const content: IFreshRSSSubscriptionsResponse = res.data;
            return content;
        }).catch((err) => {
            logger.error('Error fetching subscriptions:', err);
            throw err;
        });
    };

    public async getArticles (subscriptionId: string, continuation?: string): Promise<IFreshRSSArticle[]> {
        if (!this.auth) {
            throw new Error('Not logged in');
        }

        const url = new URL(FRESHRSS_GREADER_API_URL);
        url.pathname += `/reader/api/0/stream/contents/${subscriptionId}`;
        url.searchParams.append('n', '100');
        if (continuation != undefined && continuation !== '') {
            url.searchParams.append('c', continuation);
        }

        logger.info(url.toString());
        return axios.get(url.toString(), {
            headers: {
                Authorization: this.auth
            }
        }).then(async (res) => {
            const content: IFreshRSSArticlesResponse = res.data;
            const articles = content.items.map((article) => this.normalizeArticle(article));
            if (!content.continuation) {
                return articles;
            }

            return articles.concat(await this.getArticles(subscriptionId, content.continuation));
        }).catch((err) => {
            logger.error('Error fetching articles:', err);
            throw err;
        });
    };

    private normalizeArticle (article: IFreshRSSArticle): IFreshRSSArticle {
        article.title = normalizeTitle(article.title);
        return article;
    }
}

export default FreshRSSService;
