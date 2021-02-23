import type AdapterPlugin from '../interface';
import {
    detectEnv,
    mapHiveEnv,
    shopBaseInfo
} from '../../services/shopBaseService';
import { parseShopId } from "../../services/Util";
import { browser } from "webextension-polyfill-ts";
import type { Context } from "svelte/types/compiler/compile/nodes/shared/Context";

const FindTabsPlugin: AdapterPlugin = {
    id: 5,
    title: 'Change Tab',
    subtitle: 'Find an open tab and change to it',
    icon: 'mdi-storefront',
    hint: 'Open Hive -shop_id (default current page)',
    async action(): Promise<string> {
        throw new Error("keyword not found")
    },
    // search(...params): AdapterPlugin[] {
    //     let allTabs = []
    //     const allWindows = await browser.windows.getAll({populate: true})
    //     allWindows.forEach((browserWindow) => {
    //         allTabs = allTabs.concat(browserWindow.tabs)
    //     })
    //
    //     return allTabs.map((tab) => ({
    //         title: `Change Tab ${tab.title}`,
    //         subtitle: tab.url,
    //         icon: tab.favIconUrl || 'mdi-storefront',
    //         async action(): Promise<string> {
    //             switchToTabById(tab.windowId, tab.id)
    //             return 'do some thing'
    //         },
    //     }))
    // }
};

function switchToTabById(windowId, tabId) {
    // tabs.update is limited to switching to tabs only within the current window, thus switch to the window we need first.
    return async function closureFunc() {
        await browser.windows.update(windowId, {focused: true})
        await browser.tabs.update(tabId, {'active': true})
    }
}

export default FindTabsPlugin;
