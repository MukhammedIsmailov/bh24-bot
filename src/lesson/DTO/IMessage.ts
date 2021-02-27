export enum Type {
    Text = 'text',
    TextWithButton = 'text_with_button',
    Image = 'image',
    File = 'file',
    Audio = 'audio',
    Video = 'video',
    Animation = 'animation',
    Location = 'location'
}

export interface IMessage {
    type: Type;
    message: string;
    caption?: string;
}