export interface ILeadMessengerResponse {
    id: number;
    telegram_info?: string;
    viber_info?: string;
    facebook_info?: string;
    user_id: number;
    step: number;
    last_send_time: string;
}