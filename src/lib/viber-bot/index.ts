import { Bot } from 'viber-bot';
import {getConfig} from "../../config";

export function botConfig(): Bot {
    return new Bot({
        authToken: getConfig().viberToken,
        name: getConfig().viberBotName,
        avatar: getConfig().viberBotAvatar,
    });
}