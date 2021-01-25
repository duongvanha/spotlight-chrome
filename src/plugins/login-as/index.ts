import axios from 'axios';
import * as querystring from 'querystring';
import type AdapterPlugin from '../interface';
import { detectEnv, getUserIdFromShopId, mapHiveEnv, sessIDHive, shopBaseInfo } from '../../services/shopBaseService';

const LoginAsPlugin: AdapterPlugin = {
    id: 1,
    title: 'Login as',
    subtitle: 'Login as to shop',
    icon: 'https://i.pinimg.com/originals/3a/69/ae/3a69ae3942d4a9da6c3cbc93b1c8f051.jpg',
    hint: 'Login as -reason -shop_id (default current page)',
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

        let env = await detectEnv(envParams)

        const sess = await sessIDHive(env);

        const userId = await getUserIdFromShopId(shopId, env)

        const linkHive = mapHiveEnv[env];

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

        await browser.tabs.create({url: res.request.responseURL + 'spotlight=' + LoginAsPlugin.id});
        return '';
    },
};

export default LoginAsPlugin;
