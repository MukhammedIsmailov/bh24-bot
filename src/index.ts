import { botConfig, sendText, sendPhoto, sendAudio, sendAnimation, sendDocument, sendLocation, sendSticker, sendVideo, start } from './lib/telegram-bot';
import { readFileSync } from 'fs';

const bot = botConfig();

const chatIdFromFile: string = readFileSync('C:/git/bh24-bot/chatid.json', 'utf8');
const chat = JSON.parse(chatIdFromFile);

