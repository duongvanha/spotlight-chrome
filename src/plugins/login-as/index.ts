import axios from 'axios';
import * as querystring from 'querystring';
import type AdapterPlugin from '../interface';
import { getUserIdFromShopId, mapHiveEnv, sessIDHive, shopBaseInfo } from '../../services/shopBaseService';
import { browser } from "webextension-polyfill-ts";

const LoginAsPlugin: AdapterPlugin = {
    id: 1,
    title: 'Login as',
    subtitle: 'Login as to shop',
    icon: '',
    hint: 'Login as -reason -shop_id (default current page)',
    async action({browser}, [param1, param2]): Promise<string> {
        let shopId: number;
        let reason = '';
        if (!param2) {
            const shopData = await shopBaseInfo();
            shopId = Number(shopData.shopId);
        } else {
            shopId = Number(param2)
        }

        reason = param1;

        if (!shopId) throw new Error('Cannot detect shop id');

        if (!reason) throw new Error('Reason cannot empty');

        const sess = await sessIDHive();

        const userId = await getUserIdFromShopId(shopId)

        const linkHive = mapHiveEnv[(await shopBaseInfo()).env];

        const res = await axios.post(`${linkHive}/admin/app/shopuser/${userId}/login`, querystring.stringify({
            reason,
        }, {
            headers: {
                Cookie: `PHPSESSID=${sess}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }));

        const lastIndexUrlLogin = res.request.responseURL.lastIndexOf('/admin/login')
        if (lastIndexUrlLogin !== -1) {
            const domain = res.request.responseURL.substr(0, lastIndexUrlLogin)
            await browser.tabs.create({url: `${domain}/connect/google`});
            return ''
        }

        await browser.tabs.create({url: res.request.responseURL + '?spotlight=' + LoginAsPlugin.id});
        return '';
    },
};

export default LoginAsPlugin;
