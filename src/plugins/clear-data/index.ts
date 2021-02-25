import type AdapterPlugin from '../interface';

const ClearCheckoutPlugin: AdapterPlugin = {
    id: 8,
    title: 'Clear checkout',
    subtitle: 'Clear checkout session',
    icon: '🤖',
    async action({browser}): Promise<string> {
        const tabs = await browser.tabs.query({active: true, currentWindow: true})
        const tab = tabs[0];
        browser.tabs.executeScript(tab.id, {code: `localStorage.removeItem('shop/carts/current-checkout-token')`})
        const url = new URL(tab.url);
        const domain = url.origin + '/collections/all'
        chrome.tabs.update(tab.id, {url: domain});
        window.close();
        return domain
    },
};

export default ClearCheckoutPlugin;
