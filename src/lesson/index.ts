import { readFileSync } from 'fs';

import { ILesson } from './DTO/ILesson';
import { Type } from '../lesson/DTO/IMessage';
import { botConfig, sendText, sendPhoto, sendAudio, sendAnimation, sendDocument, sendLocation, sendSticker, sendVideo, start } from '../lib/telegram-bot';

const bot = botConfig();

const chatIdFromFile: string = readFileSync('C:/git/bh24-bot/chatid.json', 'utf8');
const chat = JSON.parse(chatIdFromFile);

export function test() {

    start(bot);
    const lessons: Array<ILesson> = JSON.parse(readFileSync(__dirname + '/../../data/lessons.json', 'utf8'));
    let number = 0;
    // setInterval(() => {
    //     send(lessons[number]);
    //     number += 1;
    // }, 5000);
}

async function send(lesson: ILesson) {
    for (const message of lesson.messages){
        switch (message.type) {
            case Type.Text:
                await sendText(bot, chat, message.message);
                break;
            case Type.Image:
                const image: Buffer = readFileSync(`${__dirname}/../..${message.message}`);
                await sendPhoto(bot, chat, image);
                break;
            case Type.File:
                const file: Buffer = readFileSync(`${__dirname}/../..${message.message}`);
                await sendDocument(bot, chat, file);
                break;
            case Type.Audio:
                const audio: Buffer = readFileSync(`${__dirname}/../..${message.message}`);
                await sendAudio(bot, chat, audio);
                break;
            case Type.Video:
                const video: Buffer = readFileSync(`${__dirname}/../..${message.message}`);
                await sendVideo(bot, chat, video);
                break;
            case Type.Animation:
                const animation: Buffer = readFileSync(`${__dirname}/../..${message.message}`);
                await sendAnimation(bot, chat, animation);
                break;
            case Type.Location:
                const inputLocation: Array<string> = message.message.split(';');
                const location = {
                    latitude: Number.parseFloat(inputLocation[0]),
                    longitude: Number.parseFloat(inputLocation[1])
                };
                await sendLocation(bot, chat, location);
                break;

            default:
                console.log('fail');
                break;
        }
    }
}
