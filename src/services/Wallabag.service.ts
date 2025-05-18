import { WALLABAG_INSTANCE_URL } from '@/config';
import { logger } from '@/utils/logger';
import { IWallabagArticle, IWallabagArticlesResponse } from '@/interfaces/Wallabag.Article.interface';
import axios from 'axios';
import { normalizeTitle } from '@/utils/normalizing';

class WallabagService {
    private auth: string | null = null;

    public async login (clientId: string, clientSecret: string, username: string, password: string): Promise<void> {
        const url = new URL(WALLABAG_INSTANCE_URL);
        url.pathname += '/oauth/v2/token';

        return axios.post(url.toString(), {
            grant_type: 'password',
            client_id: clientId,
            client_secret: clientSecret,
            username: username,
            password: password
        }).then((res) => {
            this.auth = `Bearer ${res.data.access_token}`;
        }).catch((err) => {
            logger.error('Error logging in:', err);
            throw err;
        });
    }

    public async getUnreadArticles (page: number = 1): Promise<IWallabagArticle[]> {
        if (!this.auth) {
            throw new Error('Not logged in');
        }

        const url = new URL(WALLABAG_INSTANCE_URL);
        url.pathname += '/api/entries.json';
        url.searchParams.append('page', page.toString());
        url.searchParams.append('perPage', '500');
        url.searchParams.append('archive', '0');
        url.searchParams.append('detail', 'metadata');

        logger.info(url.toString());
        return axios.get(url.toString(), {
            headers: {
                Authorization: this.auth
            }
        }).then(async (res) => {
            const content: IWallabagArticlesResponse = res.data;
            const articles: IWallabagArticle[] = content._embedded.items.map((article) => this.normalizeArticle(article));
            if (content.page >= content.pages) {
                return articles;
            }

            return articles.concat(await this.getUnreadArticles(page + 1));
        }).catch((err) => {
            logger.error('Error fetching articles:', err);
            throw err;
        });
    }

    public async markAsRead (articleId: number): Promise<void> {
        if (!this.auth) {
            throw new Error('Not logged in');
        }

        const url = new URL(WALLABAG_INSTANCE_URL);
        url.pathname += `/api/entries/${articleId}`;

        logger.info(url.toString());
        return axios.patch(url.toString(), {
            archive: 1
        }, {
            headers: {
                Authorization: this.auth
            }
        }).then(() => {
        }).catch((err) => {
            logger.error('Error marking article as read:', err);
            throw err;
        });
    }

    private normalizeArticle (article: IWallabagArticle): IWallabagArticle {
        article.title = normalizeTitle(article.title);
        return article;
    }
}

export default WallabagService;
