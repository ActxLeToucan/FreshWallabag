import { logger } from '@/utils/logger';
import {
    FRESHRSS_GREADER_API_PASSWORD,
    FRESHRSS_GREADER_API_USER,
    NODE_ENV,
    RUN_INTERVAL_MINUTES,
    WALLABAG_CLIENT_ID,
    WALLABAG_CLIENT_SECRET,
    WALLABAG_PASSWORD,
    WALLABAG_URL_PATTERN,
    WALLABAG_USERNAME
} from '@/config';
import FreshRSSService from '@/services/FreshRSS.service';
import WallabagService from '@/services/Wallabag.service';
import { IWallabagArticle } from '@/interfaces/Wallabag.Article.interface';

logger.info(`======= ENV: ${NODE_ENV} =======`);

class App {
    private freshrss: FreshRSSService;
    private wallabag: WallabagService;

    constructor () {
        this.freshrss = new FreshRSSService();
        this.wallabag = new WallabagService();
    }

    public static async loop () {
        logger.info(`== Starting loop with interval of ${RUN_INTERVAL_MINUTES} minutes ==`);

        try {
            await (new App()).run();
            setInterval(async () => {
                await (new App()).run();
            }, RUN_INTERVAL_MINUTES * 60 * 1000);
        } catch (error) {
            logger.error('Error in loop:', error);
        }
    }

    public async run () {
        logger.info('App started');

        logger.info('[ Logging in to FreshRSS and Wallabag... ]');
        await this.freshrss.login(FRESHRSS_GREADER_API_USER, FRESHRSS_GREADER_API_PASSWORD);
        logger.info(' ✅ FreshRSS login successful');
        await this.wallabag.login(WALLABAG_CLIENT_ID, WALLABAG_CLIENT_SECRET, WALLABAG_USERNAME, WALLABAG_PASSWORD);
        logger.info(' ✅ Wallabag login successful');

        logger.info('[ Fetching subscriptions from FreshRSS... ]');
        const subscriptions = await this.freshrss.getSubscriptions();
        const wallabagSubscriptions = subscriptions.subscriptions
            .filter((sub) => sub.url.match(WALLABAG_URL_PATTERN));
        logger.info(` ✅ Fetched ${subscriptions.subscriptions.length} subscriptions (${wallabagSubscriptions.length} Wallabag feeds)`);

        logger.info('[ Fetching unread articles from Wallabag... ]');
        const wallabagArticles = await this.wallabag.getUnreadArticles();
        logger.info(` ✅ Fetched ${wallabagArticles.length} articles`);

        logger.info('[ Identifying articles to mark as read... ]');
        const articlesToMarkAsRead: IWallabagArticle[] = [];
        for (const sub of wallabagSubscriptions) {
            const articles = await this.freshrss.getArticles(sub.id);
            for (const article of articles) {
                // Skip if the article is not marked as read
                if (!article.categories.includes('user/-/state/com.google/read')) {
                    continue;
                }

                // Find the corresponding Wallabag article
                const wallabagArticle = wallabagArticles.find((wa) =>
                    wa.user_name === WALLABAG_USERNAME &&
                    wa.title === article.title &&
                    wa.tags.find((tag) => article.categories.includes(tag.label)) &&
                    wa.url === article.canonical[0].href);
                // Skip if the article is already read in Wallabag
                if (!wallabagArticle) {
                    continue;
                }

                articlesToMarkAsRead.push(wallabagArticle);
            }
        }
        logger.info(` ✅ Found ${articlesToMarkAsRead.length} articles to mark as read`);

        logger.info('[ Marking articles as read in Wallabag... ]');
        for (const article of articlesToMarkAsRead) {
            await this.wallabag.markAsRead(article.id);
            logger.info(` ✅ Marked article ${article.title} as read`);
        }

        logger.info('App finished');
    }
}

try {
    App.loop();
} catch (error) {
    logger.error('Error occurred:', error);
}
