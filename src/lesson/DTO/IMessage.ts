export enum Type {
    Text = 'text',
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
}