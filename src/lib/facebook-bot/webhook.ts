import { getConfig } from '../../config';

export function verifyWebhook (ctx, next) {
    // const mode = ctx.query['hub.mode'];
    // const token = ctx.query['hub.verify_token'];
    // const challenge = ctx.query['hub.challenge'];
    //
    // if (mode && token === getConfig().facebookToken) {
    //     ctx.status = 200;
    // } else  {
    //     ctx.response.body = challenge;
    //     ctx.status = 403;
    // }

    ctx.response.body = 'pong';
    next();
}