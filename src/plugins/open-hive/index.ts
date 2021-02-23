import type AdapterPlugin from '../interface';
import {
    detectEnv,
    mapHiveEnv,
    shopBaseInfo
} from '../../services/shopBaseService';
import { parseShopId } from "../../services/Util";

const OpenHivePlugin: AdapterPlugin = {
    id: 5,
    title: 'Open Hive',
    subtitle: 'Open hive store info',
    icon: '🤖',
    hint: 'Open Hive -shop_id (default current page)',
    async action({browser}, [param2, envParams]): Promise<string> {
        let shopId: number;
        if (!param2) {
            const shopData = await shopBaseInfo();
            shopId = parseShopId(shopData.shopId);
        } else {
            shopId = parseShopId(param2)
        }

        if (!shopId) throw new Error('Cannot detect shop id');

        const linkHive = mapHiveEnv[await detectEnv(envParams)];

        browser.tabs.create({url: `${linkHive}/admin/app/shop/${shopId}/show`});
        return shopId.toString()
    },
};

export default OpenHivePlugin;
