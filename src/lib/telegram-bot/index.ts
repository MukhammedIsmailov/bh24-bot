import * as TelegramBot from 'node-telegram-bot-api';
import { Stream } from 'stream';

import { getConfig } from '../../config';
import { IChat } from './DTO/IChat';
import { ILocation} from './DTO/ILocation';

import axios from 'axios';

export function botConfig(): TelegramBot {
    const token = getConfig().telegramToken;
    return new TelegramBot(token, { polling: true });
}

export function start (bot: TelegramBot): void {
    bot.onText(/\/start/, async (msg) => {
        const chat: IChat = { id: msg.chat.id };

        const data ={
            referId: msg.text.replace('/start ', ''),
            type: 1,
            messengerInfo: {
                messenger: 'telegram',
                info: JSON.stringify(chat)
            }
        };

        await axios.put('http://localhost:3000/api/lead', data);
    });
}

export async function sendText(bot: TelegramBot, chat: IChat, message: string): Promise<void> {
   await bot.sendMessage(chat.id, message);
}

export async function sendPhoto(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendPhoto(chat.id, message);
}

export async function sendSticker(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendSticker(chat.id, message);
}

export async function sendAnimation(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendAnimation(chat.id, message);
}

export async function sendAudio(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendAudio(chat.id, message);
}

export async function sendDocument(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendDocument(chat.id, message);
}

export async function sendVideo(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendVideo(chat.id, message);
}

export async function sendLocation(bot: TelegramBot, chat: IChat, message: ILocation): Promise<void> {
    await bot.sendLocation(chat.id, message.latitude, message.longitude);
}
