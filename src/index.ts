import { botConfig, start, sendMessage } from './lib/telegram-bot';
import { getData } from '../data';
import {IMessage} from "./lesson/DTO/IMessage";

const data = getData();
const bot = botConfig();
const chat = { id: '419931906' };
let count = 0;

const interval = setInterval(() => {
    if (count < data.length) {
        data[count].messages.forEach(message => {
            sendMessage(bot, chat, message as IMessage);
        });
        count++;
    } else {
        clearInterval(interval);
        count = 0;
    }
}, 10000);
