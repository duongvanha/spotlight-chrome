import { browser } from 'webextension-polyfill-ts';
import axios from "axios";

const shopBaseInfo = () => browser.tabs
    .query({active: true, currentWindow: true})
    .then(([currentTab]) =>
        browser.tabs.executeScript(currentTab.id, {code: `localStorage['spotlight-ext-sbase']`}),
    ).then(([stateString]) => JSON.parse(stateString)).catch(err => {
        console.log('shopBaseInfo', err);
    });


const sessIDHive = async function () {
    return browser.cookies.get({
        url: 'https://hive.shopbase.com',
        name: 'PHPSESSID',
    });
};

const regexUserId = /(.*hive.*.shopbase.\w{3}).*/;

async function getUserIdFromShopId(shopId: number): Promise<Number> {
    const getUser = await axios.get(`https://hive.shopbase.com/admin/app/shop/${shopId}/show`, {
        headers: {
            Cookie: `PHPSESSID=${await sessIDHive()}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const lastIndexUrlLogin = getUser.request.responseURL.lastIndexOf('/admin/login')
    if (lastIndexUrlLogin) {
        const domain = getUser.request.responseURL.substr(0, lastIndexUrlLogin)
        await browser.tabs.create({url: `${domain}/connect/google`});
    }

    const rs = getUser.data.match(regexUserId);

    if (!rs || !rs[1]) {
        throw new Error('Cannot detect owner id');
    }
    return rs[1]
}

export { shopBaseInfo, sessIDHive, getUserIdFromShopId };