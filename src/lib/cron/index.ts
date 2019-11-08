import { CronJob } from 'cron';
import axios from 'axios';
import * as TelegramBot from 'node-telegram-bot-api';

import { getConfig } from '../../config';
import { ILeadMessengerResponse } from './DTO/ILeadMessengerResponse';
import { sendMessage } from '../telegram-bot';
import { IChat } from '../telegram-bot/DTO/IChat';
import { getData } from '../../../data';
import { IMessage } from '../../lesson/DTO/IMessage';

const config = getConfig();

export function getCronJobForNewsletter (bot: TelegramBot): CronJob {
    return new CronJob('*/1 * * * *', async () => {
        const response = await axios.get(`${config.adminServiceBaseUrl}/api/lead/messenger/all?interval=1%20hour`);
        const responseData = <Array<ILeadMessengerResponse>>response.data;
        const data = getData();
        for (const leadInfo of responseData) {
            const step = leadInfo.step;
            if(!!leadInfo.telegram_info && leadInfo.telegram_info.length > 0 && step <= data.length) {
                const chat: IChat = JSON.parse(leadInfo.telegram_info);
                for (const message of data[step].messages) {
                    sendMessage(bot, chat, message as IMessage);
                    const data = JSON.stringify({
                        id: leadInfo.id,
                        step: leadInfo.step + 1,
                    });
                    const options = { headers: { 'Content-Type': 'application/json', }};
                    axios.post(`${config.adminServiceBaseUrl}/api/lead/messenger`, data, options);
                }
            }
        }
    });
}