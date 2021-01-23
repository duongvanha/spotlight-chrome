import axios from 'axios';
import * as querystring from 'querystring';
import type AdapterPlugin from '../interface';
import { sessIDHive, shopBaseInfo } from '../../services/shopBaseService';

const regexUserId = /.*\/shopuser\/(\d+)\/show.*/;
const LoginAsPlugin: AdapterPlugin = {
    id: 1,
    title: 'Login as',
    subtitle: 'Login as to shop',
    icon: '',
    hint: 'Login as -reason -shop_id (default current page)',
    async action({browser}, [param1, param2]): Promise<string> {
        let shopId = param2;
        let reason = '';
        if (shopId === null || shopId === "") {
            const shopData = await shopBaseInfo;
            shopId = shopData.bootstrap.shopId;
        }

        reason = param1;

        if (!shopId) throw new Error('Cannot detect shop id');

        if (!reason) throw new Error('Reason cannot empty');

        const sess = await sessIDHive();

        const getUser = await axios.get(`https://hive.shopbase.com/admin/app/shop/${shopId}/show`, {
            headers: {
                Cookie: `PHPSESSID=${sess}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (getUser.request.responseURL.endsWith('/admin/login')) {
            await browser.tabs.create({url: getUser.request.responseURL + '?spotlight=' + LoginAsPlugin.id});
            return '';
        }

        const rs = getUser.data.match(regexUserId);

        if (!rs || !rs[1]) {
            throw new Error('Cannot detect owner id');
        }

        const res = await axios.post(`https://hive.shopbase.com/admin/app/shopuser/${rs[1]}/login`, querystring.stringify({
            reason,
        }, {
            headers: {
                Cookie: `PHPSESSID=${sess}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }));

        await browser.tabs.create({url: res.request.responseURL + '?spotlight=' + LoginAsPlugin.id});
        return '';
    },
};

export default LoginAsPlugin;
