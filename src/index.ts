// import { botConfig, start, sendMessage } from './lib/telegram-bot';
// import { getData } from '../data';
// import {IMessage} from "./lesson/DTO/IMessage";
//
// const data = getData();
// const bot = botConfig();
// const chat = { id: '419931906' };
// let count = 0;
//
// const interval = setInterval(() => {
//     if (count < data.length) {
//         data[count].messages.forEach(message => {
//             sendMessage(bot, chat, message as IMessage);
//         });
//         count++;
//     } else {
//         clearInterval(interval);
//         count = 0;
//     }
// }, 10000);

import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';

import { getConfig } from './config';
import { verifyWebhook } from './lib/facebook-bot/webhook';

const app = new Koa();
const port = getConfig().appPort;

const routes = new Router();
routes.get('/facebook', verifyWebhook);
app.use(routes.routes()).use(routes.allowedMethods());

app.use(bodyParser());

app.listen(port, () => {
    console.log(port);
});

// import { getCronJobForNewsletter } from './lib/cron';
// import { botConfig, start } from './lib/telegram-bot';
//
// const bot = botConfig();
//
// start(bot);
// getCronJobForNewsletter(bot).start();