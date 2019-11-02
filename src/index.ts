import { readFileSync } from 'fs';
import { botConfig as telegramBotConfig, sendText, sendPhoto, sendAudio, sendAnimation, sendDocument, sendLocation, sendSticker, sendVideo, start } from './lib/telegram-bot';
import { botConfig as viberBotConfig } from './lib/viber-bot';

// const telegramBot = telegramBotConfig();

// const chatIdFromFile: string = readFileSync('C:/git/bh24-bot/chatid.json', 'utf8');
// const chat = JSON.parse(chatIdFromFile);

const viberBot = viberBotConfig();

console.log(viberBot);

