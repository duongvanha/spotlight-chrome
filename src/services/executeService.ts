import { browser } from 'webextension-polyfill-ts';

import type AdapterPlugin from "../plugins/interface";
import { shopBaseInfo } from "./shopBaseService";

function execute(adapterPlugin: AdapterPlugin, ...params: string[]): Promise<any> {

    return adapterPlugin.action({
        browser: browser,
        ShopData: shopBaseInfo,
    }, params)

}

export default execute
