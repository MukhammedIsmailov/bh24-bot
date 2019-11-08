import * as TelegramBot from 'node-telegram-bot-api';
import { Stream } from 'stream';
import { readFileSync } from 'fs';
import { join } from 'path';

import { getConfig } from '../../config';
import { getData } from '../../../data';
import { IChat } from './DTO/IChat';
import { ILocation } from './DTO/ILocation';
import { IMessage, Type } from '../../lesson/DTO/IMessage';

import axios from 'axios';

const config = getConfig();

export function botConfig(): TelegramBot {
    const token = config.telegramToken;
    return new TelegramBot(token, { polling: true });
}

export function start (bot: TelegramBot): void {
    bot.onText(/\/start/, async (msg) => {
        const chat: IChat = msg.chat;
        const data = {
            referId: msg.text.replace('/start ', ''),
            type: 1,
            messengerInfo: {
                messenger: 'telegram',
                info: JSON.stringify(chat),
                step: 1,
            }
        };

        getData()[0].messages.forEach((message: IMessage) => {
            sendMessage(bot, chat, message);
        });

        axios.put(`${config.adminServiceBaseUrl}/api/lead`, data);
    });
}

export async function sendMessage(bot: TelegramBot, chat: IChat, message: IMessage): Promise<void> {
    const type: Type = message.type;
    switch (type) {
        case Type.Text:
            sendText(bot, chat, message.message);
            break;

        case Type.Image:
            await sendPhoto(bot, chat, readFileSync(join(__dirname, '../../../',  message.message)));
            break;

        case Type.Audio:
            await sendAudio(bot, chat, readFileSync(join(__dirname, '../../../', message.message)));
            break;
    }
}

async function sendText(bot: TelegramBot, chat: IChat, message: string): Promise<void> {
    await bot.sendMessage(chat.id, message.replace('/name/', chat.first_name));
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
