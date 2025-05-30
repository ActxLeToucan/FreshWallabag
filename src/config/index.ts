import validateEnv from '@/utils/envValidator';

export const {
    NODE_ENV,
    LOG_DIR,
    RUN_INTERVAL_MINUTES,
    FRESHRSS_GREADER_API_URL,
    FRESHRSS_GREADER_API_USER,
    FRESHRSS_GREADER_API_PASSWORD,
    WALLABAG_URL_PATTERN,
    WALLABAG_INSTANCE_URL,
    WALLABAG_CLIENT_ID,
    WALLABAG_CLIENT_SECRET,
    WALLABAG_USERNAME,
    WALLABAG_PASSWORD,
} = validateEnv();
