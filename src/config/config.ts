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
            viberToken: process.env.VIBER_TOKEN,
            viberBotName: process.env.VIBER_BOT_NAME,
            viberBotAvatar: process.env.VIBER_BOT_AVATAR,
        }
    }
}