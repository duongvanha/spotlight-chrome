import type AdapterPlugin from '../interface';
import { shopBaseInfo } from "../../services/shopBaseService";
import { copyToClipboard } from "../../services/Util";

const CopyShopIdPlugin: AdapterPlugin = {
    id: 3,
    title: 'Copy shopId',
    subtitle: 'Show and copy shopId to clipboard',
    icon: '',
    hint: 'Copy shopId',
    async action(): Promise<string> {
        const shopData = await shopBaseInfo();
        if (!shopData.shopId) throw new Error('Cannot detect shop id');

        copyToClipboard(shopData.shopId)

        return `${shopData.shopId}`
    },
};

export default CopyShopIdPlugin;