import { browser } from 'webextension-polyfill-ts';

import type AdapterPlugin from "../plugins/interface";
import { shopBaseInfo } from "./shopBaseService";

async function execute(adapterPlugin: AdapterPlugin, ...params: string[]): Promise<any> {

    return adapterPlugin.action({
        browser: browser,
        ShopData: await shopBaseInfo(),
    }, params)

}

export default execute
