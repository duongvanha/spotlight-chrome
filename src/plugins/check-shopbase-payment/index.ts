import type AdapterPlugin from '../interface';
import { copyToClipboard, getCache, setCache } from '../../services/Util';
import type {ShopBaseStorage} from "../../window";
import { shopBaseInfo } from '../../services/shopBaseService';
import { parseShopId } from '../../services/Util';
import axios from 'axios';

const SpayInfo: AdapterPlugin = {
    id: 7,
    title: 'Check SPay Info',
    subtitle: 'Check Shopbase Payment Info',
    icon: '🦁',
    hint: 'SPay Info -shop_id (default current page)',
    async action({browser}, [param2]): Promise<string> {
        let shopId: number;
        let shopData: ShopBaseStorage;
        if (!param2) {
            shopData = await shopBaseInfo();
            shopId = parseShopId(shopData.shopId);
        } else {
            shopId = parseShopId(param2)
        }

        if (!shopId) throw new Error('Cannot detect shop id');

        const cacheKey = `spay-${shopId}`

        let cacheShopPaymentInfo = await getCache(cacheKey).catch(() => null)

        if(!cacheShopPaymentInfo || (!cacheShopPaymentInfo.rs_id && shopData.accessToken)) {
            if(shopData.accessToken) {
                let [connectedAccount, paymentMethod = []] = [
                    (await axios.get(`https://${shopData.host}/admin/shopbase_payments/connected_account.json`, { 'headers': { 'x-shopbase-access-token': shopData.accessToken }}).then(rs => rs.data.account)),
                    (await axios.get(`https://${shopData.host}/admin/payments.json`, { 'headers': { 'x-shopbase-access-token': shopData.accessToken }}).then(rs => rs.data.payment_methods)),
                ]

                cacheShopPaymentInfo = {
                    gateway_account_id: paymentMethod?.sort(i => i.active).filter(i => i.code === "shopbase")[0]?.provider_options?.gateway_account_id,
                    gateway: connectedAccount.gateway,
                    rs_id: connectedAccount.connect_id,
                }

                await setCache(cacheKey, cacheShopPaymentInfo).catch(() => null)

            } else {
                const rs = (await axios.get(`https://${shopData.host}/api/checkout/1/payment-methods.json`).then(res => res.data.result)) || []
                cacheShopPaymentInfo = rs.filter(r => r.code === "platform")[0]?.provider_options
                await setCache(cacheKey, cacheShopPaymentInfo).catch(() => null)
            }
        }

        if(cacheShopPaymentInfo.rs_id) {
            copyToClipboard(cacheShopPaymentInfo.rs_id)

        } else {

            copyToClipboard(cacheShopPaymentInfo.gateway_account_id)
        }

        if (cacheShopPaymentInfo.gateway_account_id) {

            return `Account ${cacheShopPaymentInfo.gateway_account_id} using gateway ${cacheShopPaymentInfo.gateway}`
        }

        return `Account ${cacheShopPaymentInfo.rs_id} using gateway ${cacheShopPaymentInfo.gateway}`
    },
};

export default SpayInfo;
