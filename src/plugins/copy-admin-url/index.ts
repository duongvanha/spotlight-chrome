import type AdapterPlugin from '../interface';
import { shopBaseInfo } from '../../services/shopBaseService';
import { base64Encode, copyToClipboard } from "../../services/Util";



const ShareAdminUrlPlugin: AdapterPlugin = {
    id: 9,
    title: 'Copy admin url',
    subtitle: 'Copy admin url with access token',
    icon: '🚒',
    hint: "Do not use with the seller's store",
    async action({browser}): Promise<string> {
        const shopData = await shopBaseInfo();

        if (!shopData.accessToken) throw new Error('Cannot detect shop access token');

        const tabs = await browser.tabs.query({active: true, currentWindow: true})
        const tab = tabs[0];
        const url = new URL(tab.url);
        console.log(url, shopData.accessToken);
        url.searchParams.append('access_token', shopData.accessToken);
        url.searchParams.append('scopes', base64Encode(JSON.stringify(["admin/*"])));
        url.searchParams.append('shop_data', base64Encode(
            JSON.stringify({
                id: shopData.shopId,
                email: shopData.email,
            })
        ));

        copyToClipboard(url.href)

        return `copied success to clipboard`
    },
};

export default ShareAdminUrlPlugin;
