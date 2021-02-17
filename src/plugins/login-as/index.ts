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
import { parseShopId } from "../../services/Util";

const LoginAsPlugin: AdapterPlugin = {
    id: 1,
    title: 'Login as',
    subtitle: 'Login as current shop',
    icon: 'mdi-login',
    hint: 'Login as -reason -shop_id (default current page)',
    async action({browser}, [reason, param2, envParams]): Promise<string> {
        let shopId: number;
        if (!param2) {
            const shopData = await shopBaseInfo();
            shopId = parseShopId(shopData.shopId);
        } else {
            shopId = parseShopId(param2)
        }

        if (!shopId) throw new Error('Cannot detect shop id');

        if (!reason) throw new Error('Reason cannot empty');

        let env = await detectEnv(envParams)

        const sess = await sessIDHive(env);

        const shopInfo = await getShopBaseInfo(shopId, env)

        const linkHive = mapHiveEnv[env];

        const res = await axios.post(`${linkHive}/admin/app/shopuser/${shopInfo.ownerId}/login`, querystring.stringify({
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

        browser.tabs.create({url: res.request.responseURL + 'spotlight=' + LoginAsPlugin.id});
        return '';
    },
};

export default LoginAsPlugin;
