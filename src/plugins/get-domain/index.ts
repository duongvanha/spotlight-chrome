import type AdapterPlugin from '../interface';
import { detectEnv, mapHiveEnv, sessIDHive, shopBaseInfo } from "../../services/shopBaseService";
import axios from "axios";
import { copyToClipboard } from "../../services/Util";

const publicDomain = /.*<th>Public Domain<\/th>\n<td>(.*)<\/td>.*/
const shopBaseDomain = /.*<th>Domain<\/th>\n<td>(.*)<\/td>.*/
const FindDomainPlugin: AdapterPlugin = {
    id: 2,
    title: 'Find domain',
    subtitle: 'Find domain from shop',
    icon: '',
    hint: 'Find domain -shop_id (default current page)',
    async action({browser}, [param, envParams]): Promise<string> {
        let shopId: number;
        if (!param) {
            const shopData = await shopBaseInfo();
            shopId = Number(shopData.shopId);
        } else {
            shopId = Number(param)
        }

        if (!shopId) throw new Error('Cannot detect shop id');

        let env = await detectEnv(envParams)
        const linkHive = mapHiveEnv[env];
        const shopInfo = await axios.get(`${linkHive}/admin/app/shop/${shopId}/show`, {
            headers: {
                Cookie: `PHPSESSID=${await sessIDHive(env)}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log(shopInfo);
        let rs = publicDomain.exec(shopInfo.data)
        if (!rs || !rs[1]) {
            throw new Error('Cannot detect public domain');
        }
        let pubDomain = rs[1]
        rs = shopBaseDomain.exec(shopInfo.data)
        if (!rs || !rs[1]) {
            throw new Error('Cannot detect shopbase domain');
        }
        let sbaseDomain = rs[1]

        copyToClipboard(pubDomain)

        return `${pubDomain}\n${sbaseDomain}`
    },
};

export default FindDomainPlugin;
