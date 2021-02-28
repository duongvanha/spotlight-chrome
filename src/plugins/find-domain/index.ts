import type AdapterPlugin from '../interface';
import { detectEnv, getShopBaseInfo, shopBaseInfo } from "../../services/shopBaseService";
import { copyToClipboard, parseShopId } from "../../services/Util";

const FindDomainPlugin: AdapterPlugin = {
    id: 2,
    title: 'Find domain',
    subtitle: 'Find domain from shop',
    icon: '✈️',
    hint: 'Find domain -shop_id (default current page)',
    async action({browser}, [param, envParams]): Promise<string> {
        let shopId: number;
        if (!param) {
            const shopData = await shopBaseInfo();
            shopId = parseShopId(shopData.shopId);
        } else {
            shopId = parseShopId(param)
        }

        if (!shopId) throw new Error('Cannot detect shop id');

        let env = await detectEnv(envParams)
        const shopInfo = await getShopBaseInfo(shopId, env);

        copyToClipboard(shopInfo.publicDomain)

        return `${shopInfo.publicDomain}\n${shopInfo.shopBaseDomain}`
    },
};

export default FindDomainPlugin;
