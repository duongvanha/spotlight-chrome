import axios from 'axios';
import type AdapterPlugin from '../interface';
import {sessIDHive, shopBaseInfo} from '../../services/shopBaseService';
import * as querystring from 'querystring';

const regexUserId = /.*\/shopuser\/(\d+)\/show.*/;
const LoginAsPlugin: AdapterPlugin = {
    title: 'Login as',
    subtitle: 'Login as to shop',
    icon: '',
    hint: 'Login as -shop_id or reason -reason(require nếu $1 là shop_id)',
    async action({browser}, [param1, param2]): Promise<string> {
        let shopId = 0;
        let reason = '';
        if (!isNaN(Number(param1))) {
            shopId = Number(param1);
            reason = param2;
        } else {
            const shopData = await shopBaseInfo;
            shopId = shopData.bootstrap.shopId;
            reason = param1;
        }

        if (!reason) throw new Error('Reason cannot empty');

        const sess = await sessIDHive;

        const getUser = await axios.get(`https://hive.shopbase.com/admin/app/shop/${shopId}/show`, {
            headers: {
                Cookie: `PHPSESSID=${sess}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (getUser.request.responseURL.endsWith('/admin/login')) {
            await browser.tabs.create({url: getUser.request.responseURL});
            return '';
        }

        const rs = getUser.data.match(regexUserId);

        if (!rs || !rs[1]) {
            return '';
        }

        const res = await axios.post(`https://hive.shopbase.com/admin/app/shopuser/${rs[1]}/login`, querystring.stringify({
            reason,
        }, {
            headers: {
                Cookie: `PHPSESSID=${sess}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }));

        await browser.tabs.create({url: res.request.responseURL});
        return '';
    },
};

export default LoginAsPlugin;
