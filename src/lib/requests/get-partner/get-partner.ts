import axios from 'axios';
import {IPartner} from './IPartner';
import {getConfig} from '../../../config';

const config = getConfig();
export default async function getPartner (id): Promise<IPartner> {
    const resp = await axios.get<IPartner>(`${config.adminServiceBaseUrl}/api/partner/byUserId?userId=${id}`);
    return resp.data
}