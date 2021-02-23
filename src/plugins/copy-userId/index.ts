import type AdapterPlugin from '../interface';
import { getShopBaseInfo, shopBaseInfo } from "../../services/shopBaseService";
import { copyToClipboard } from "../../services/Util";

const CopyUserIdPlugin: AdapterPlugin = {
    id: 4,
    title: 'Copy user id',
    subtitle: 'Show and copy user id to clipboard',
    icon: '🤖',
    hint: 'Copy user id',
    async action(): Promise<string> {
        const shopData = await shopBaseInfo();
        let userId = shopData.userId
        if (!userId) {
            if (!shopData.shopId) throw new Error('Cannot detect shop id');
            userId = (await getShopBaseInfo(shopData.shopId, shopData.env)).ownerId
        }

        copyToClipboard(userId)

        return `${userId}`
    },
};

export default CopyUserIdPlugin;
