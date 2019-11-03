import { IMessage } from './IMessage';

export interface ILesson {
    lesson: number;
    messages: IMessage[];
}