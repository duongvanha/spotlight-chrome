import type AdapterPlugin from '../interface';
import { getUserIdFromShopId, shopBaseInfo } from "../../services/shopBaseService";
import { copyToClipboard } from "../../services/Util";

const CopyUserIdPlugin: AdapterPlugin = {
    id: 4,
    title: 'Copy userId',
    subtitle: 'Show and copy userId to clipboard',
    icon: '',
    hint: 'Copy userId',
    async action(): Promise<string> {
        const shopData = await shopBaseInfo();
        let userId = shopData.userId
        if (!userId) {
            if (!shopData.shopId) throw new Error('Cannot detect shop id');
            userId = await getUserIdFromShopId(shopData.shopId, shopData.env)
        }

        copyToClipboard(userId)

        return `${userId}`
    },
};

export default CopyUserIdPlugin;