import { config } from 'dotenv';

export class Config {
    private static instance: Config;

    private constructor() {
        config();
    }
    static initialConfig() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    getConfig() {
        return {
            telegramToken: process.env.TELEGRAM_TOKEN,
            facebookToken: process.env.FACEBOOK_TOKEN,
            appPort: process.env.APP_PORT,
            adminServiceBaseUrl: process.env.ADMIN_SERVICE_BASE_URL
        }
    }
}