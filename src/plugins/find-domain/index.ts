import type AdapterPlugin from '../interface';
import { detectEnv, getShopBaseInfo, shopBaseInfo } from '../../services/shopBaseService';
import { copyToClipboard, parseShopId } from '../../services/Util';

const FindDomainPlugin: AdapterPlugin = {
    id: 2,
    title: 'Find domain',
    subtitle: 'Find domain from shop',
    icon: '✈️',
    hint: 'Find domain -isPublishDomain (1 or 0) -shop (default current page)',
    async action({browser}, [pub, param, envParams]): Promise<string> {
        let shopId: number;
        const shopData = await shopBaseInfo();

        if (!param) {
            shopId = parseShopId(shopData.shopId);
        } else {
            shopId = parseShopId(param)
        }

        if (pub !== '1') {
            copyToClipboard("https://"+shopData.host)
            return `https://${shopData.host}`
        }

        if (!shopId) throw new Error('Cannot detect shop id');

        let env = await detectEnv(envParams)
        const shopInfo = await getShopBaseInfo(shopId, env);

        copyToClipboard(shopInfo.shopBaseDomain)

        return `${shopInfo.publicDomain} ${shopInfo.shopBaseDomain}`
    },
};

export default FindDomainPlugin;
