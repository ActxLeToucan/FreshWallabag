import dotenv from 'dotenv';
import { cleanEnv, num, str } from 'envalid';

dotenv.config();

const validateEnv = () => {
    return cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'test', 'production', 'staging']
        }),
        LOG_DIR: str({ default: '/logs' }),
        RUN_INTERVAL_MINUTES: num({
            default: 20,
            desc: 'Interval in minutes to run the script'
        }),
        FRESHRSS_GREADER_API_URL: str(),
        FRESHRSS_GREADER_API_USER: str(),
        FRESHRSS_GREADER_API_PASSWORD: str(),
        WALLABAG_URL_PATTERN: str(),
        WALLABAG_INSTANCE_URL: str(),
        WALLABAG_CLIENT_ID: str(),
        WALLABAG_CLIENT_SECRET: str(),
        WALLABAG_USERNAME: str(),
        WALLABAG_PASSWORD: str(),
    });
};

export default validateEnv;
