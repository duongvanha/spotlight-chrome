import type AdapterPlugin from '../interface';

const CollectionAllPlugin: AdapterPlugin = {
    id: 7,
    title: 'Collection all',
    subtitle: 'Open collection all page',
    icon: '🤖',
    async action({browser}): Promise<string> {
        const tabs = await browser.tabs.query({active: true, currentWindow: true})
        const tab = tabs[0];
        const url = new URL(tab.url);
        const domain = url.origin + '/collections/all'
        chrome.tabs.update(tab.id, {url: domain});
        window.close();
        return domain
    },
};

export default CollectionAllPlugin;
