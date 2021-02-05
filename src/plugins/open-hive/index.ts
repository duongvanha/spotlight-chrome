import axios from 'axios';
import * as querystring from 'querystring';
import type AdapterPlugin from '../interface';
import {
    detectEnv,
    getShopBaseInfo,
    mapHiveEnv,
    sessIDHive,
    shopBaseInfo
} from '../../services/shopBaseService';

const OpenHivePlugin: AdapterPlugin = {
    id: 5,
    title: 'Open Hive',
    subtitle: 'Open hive shop info',
    icon: 'mdi-storefront',
    hint: 'Open Hive -shop_id (default current page)',
    async action({browser}, [reason, param2, envParams]): Promise<string> {
        let shopId: number;
        if (!param2) {
            const shopData = await shopBaseInfo();
            shopId = Number(shopData.shopId);
        } else {
            shopId = Number(param2)
        }

        if (!shopId) throw new Error('Cannot detect shop id');

        if (!reason) throw new Error('Reason cannot empty');

        const linkHive = mapHiveEnv[await detectEnv(envParams)];

        browser.tabs.create({url: `${linkHive}/admin/app/shop/${shopId}/show`});
        return shopId.toString()
    },
};

export default OpenHivePlugin;
