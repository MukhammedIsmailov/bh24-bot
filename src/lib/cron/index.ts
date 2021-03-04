import {CronJob} from 'cron';
import axios from 'axios';
import * as TelegramBot from 'node-telegram-bot-api';

import {getConfig} from '../../config';
import {ILeadMessengerResponse} from './DTO/ILeadMessengerResponse';
import {sendMessage, sendPhoto} from '../telegram-bot';
import {IChat} from '../telegram-bot/DTO/IChat';
import {getData} from '../../../data';
import {IMessage, Type} from '../../lesson/DTO/IMessage';
import {getPartner} from '../requests';

const config = getConfig();

export function getCronJobForNewsletter (bot: TelegramBot): CronJob {
    return new CronJob('* */24 * * *', async () => {
        const response = await axios.get(`${config.adminServiceBaseUrl}/api/lead/messenger/all?interval=24%20hour`,
            //{httpsAgent: new Agent({ rejectUnauthorized: false })}
            );
        const responseData = <Array<ILeadMessengerResponse>>response.data;
        const data = getData();
        for (const leadInfo of responseData) {
            const step = leadInfo.step;
            if(!!leadInfo.telegram_info && leadInfo.telegram_info.length > 0 && step < data.length) {
                const chat: IChat = JSON.parse(leadInfo.telegram_info);
                let url = null;
                for (const message of data[step].messages) {
                    if (message.type === Type.TextWithButton) {
                        url = `${config.lessonsPageUrl}?userId=${leadInfo.user_id}&lessonId=${step+1}`;
                    }
                    await new Promise(resolve => setTimeout(() => resolve(sendMessage(bot, chat, message as IMessage, url)), 5000));
                }

                const consult = await getPartner(leadInfo.user_id);
                let consultMessage = `Ваш консультант \n${consult.firstName} ${consult.secondName}\n${consult.leaderDescription}\n`;
                if (consult.phoneNumber) consultMessage += `Телефон: ${consult.phoneNumber}\n`;
                if (consult.email) consultMessage += `Email: ${consult.email}\n`;
                if (consult.telegram) consultMessage += `Telegram: ${consult.telegram}\n`;
                if (consult.facebook) consultMessage += `Facebook: ${consult.facebook}\n`;
                if (consult.viber) consultMessage += `Viber: ${consult.viber}\n`;
                if (consult.vk) consultMessage += `VK: ${consult.vk}\n`;
                if (consult.whatsapp) consultMessage += `WhatsApp: ${consult.whatsapp}`;
                if (consult.skype) consultMessage += `Skype: ${consult.skype}`;

                if (step === 4)
                    await sendPhoto(bot, chat, `https://api.gohappy.team/data${consult.iconUrl}`, consultMessage);

                console.log(`POST: /api/lead/messenger, ${JSON.stringify({ id: leadInfo.user_id, step: step + 1})}`);
                await axios.post(`${config.adminServiceBaseUrl}/api/lead/messenger`, { id: leadInfo.user_id, step: step + 1},
                    // {httpsAgent: new Agent({ rejectUnauthorized: false })}
                );
                console.log(`PUT: /api/lesson-event, ${JSON.stringify({ id: leadInfo.user_id, step: step + 1})}`);
                await axios.put(`${config.adminServiceBaseUrl}/api/lesson-event`, { id: leadInfo.user_id, step: step + 1 },
                //     {
                //     httpsAgent: new Agent({ rejectUnauthorized: false }),
                // }
                );
            }
        }
    });
}
