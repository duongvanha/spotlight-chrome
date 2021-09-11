import type AdapterPlugin from '../interface';
import { browser } from 'webextension-polyfill-ts';

const FindTabsPlugin: AdapterPlugin = {
    id: 5,
    title: 'Change Tab',
    subtitle: 'Find an open tab and change tab to it',
    icon: '🕵',
    hint: 'Change Tab -shop_id (default current page)',
    async action(): Promise<string> {
        throw new Error("keyword not found")
    },
    async search(): Promise<AdapterPlugin[]> {
        let allTabs = []
        const allWindows = await browser.windows.getAll({populate: true})
        allWindows.forEach((browserWindow) => {
            allTabs = allTabs.concat(browserWindow.tabs)
        })

        return allTabs.map((tab) => ({
            id: 5,
            title: `Change Tab`,
            subtitle: tab.title,
            icon: '🕵',
            // hint: tab.
            async action(): Promise<string> {
                switchToTabById(tab.windowId, tab.id)
                return 'do some thing'
            },
        }))
    }
};

function switchToTabById(windowId, tabId) {
    // tabs.update is limited to switching to tabs only within the current window, thus switch to the window we need first.
    return async function closureFunc() {
        await browser.windows.update(windowId, {focused: true})
        await browser.tabs.update(tabId, {'active': true})
    }
}

export default FindTabsPlugin;
