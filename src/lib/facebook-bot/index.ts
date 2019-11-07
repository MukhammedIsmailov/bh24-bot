import * as FacebookBot from 'messenger-bot';

import { getConfig } from '../../config';

export function botConfig() {
    return new FacebookBot(getConfig().facebookToken);
}

