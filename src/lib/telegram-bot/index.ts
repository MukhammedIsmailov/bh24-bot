import * as TelegramBot from 'node-telegram-bot-api';
import {Stream} from 'stream';
import {readFileSync} from 'fs';
import {join} from 'path';

import {getConfig} from '../../config';
import {getData} from '../../../data';
import {IChat} from './DTO/IChat';
import {ILocation} from './DTO/ILocation';
import {IMessage, Type} from '../../lesson/DTO/IMessage';

import { Agent } from 'https';

import axios from 'axios';

const config = getConfig();

export function botConfig(): TelegramBot {
    const token = config.telegramToken;
    return new TelegramBot(token, { polling: true });
}

export function start (bot: TelegramBot): void {
    bot.onText(/\/start/, async (msg, match) => {
        const queryParams = msg.text.replace('/start ', '').split('_AND_');
        const chat: IChat = msg.chat;
        console.log('---DEBUG---');
        console.log(JSON.stringify(msg));
        console.log(JSON.stringify(match));
        console.log('---DEBUG---');
        const data = {
            referId: queryParams[0],
            country: queryParams[1],
            messengerInfo: {
                messenger: 'telegram',
                info: JSON.stringify( { id: chat.id, first_name: !!chat.first_name ? chat.first_name : 'Уважаемый' }),
                step: 1,
                first_name: chat.first_name,
                second_name: chat.last_name,
                username: chat.username,
            }
        };

        console.log(`PUT: /api/lead, ${JSON.stringify(data)}`);
        const lead: any = await axios.put(`${config.adminServiceBaseUrl}/api/lead`, data,
        //     {
        //     httpsAgent: new Agent({ rejectUnauthorized: false }
        //     ),
        // }
        );

        getData()[0].messages.forEach(async (message: IMessage) => {
            let url = null;
            if (message.type === Type.Text) {
                url = `${config.lessonsPageUrl}?userId=${lead.data.id}&lessonId=1`;
            }
            await sendMessage(bot, chat, message, url);
        });
        console.log(`PUT: /api/lesson-event, ${JSON.stringify({id: lead.data.id, step: 1})}`);
        await axios.put(`${config.adminServiceBaseUrl}/api/lesson-event`, { id: lead.data.id, step: 1 },
            // {
        //     httpsAgent: new Agent({ rejectUnauthorized: false }
        //     )
        // }
        );
    });
}

export async function sendMessage(bot: TelegramBot, chat: IChat, message: IMessage, url?: string): Promise<void> {
    const type: Type = message.type;
    switch (type) {
        case Type.Text:
            setTimeout(() => {
                sendMessageWithButton(bot, chat, message.message, url);
            }, 2000);
            break;
        case Type.Image:
            await sendPhoto(bot, chat, readFileSync(join(__dirname, '../../../',  message.message)));
            break;

        case Type.Audio:
            await sendAudio(bot, chat, readFileSync(join(__dirname, '../../../', message.message)));
            break;
    }
}

async function sendText(bot: TelegramBot, chat: IChat, message: string, url?: string): Promise<void> {
    await bot.sendMessage(chat.id, message.replace('/name/', chat.first_name) + '\n' +  url);
}

async function sendPhoto(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendPhoto(chat.id, message);
}

async function sendSticker(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendSticker(chat.id, message);
}

async function sendAnimation(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendAnimation(chat.id, message);
}

async function sendAudio(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendAudio(chat.id, message);
}

async function sendDocument(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendDocument(chat.id, message);
}

async function sendVideo(bot: TelegramBot, chat: IChat, message: Buffer | Stream | string): Promise<void> {
    await bot.sendVideo(chat.id, message);
}

async function sendLocation(bot: TelegramBot, chat: IChat, message: ILocation): Promise<void> {
    await bot.sendLocation(chat.id, message.latitude, message.longitude);
}

async function sendMessageWithButton(bot: TelegramBot, chat: IChat, message: string, url?: string): Promise<void> {
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Смотреть видео', url: url }],
            ]
        })
    };

    await bot.sendMessage(chat.id, message.replace('/name/', chat.first_name), options);
}