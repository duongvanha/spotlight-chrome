import { browser } from 'webextension-polyfill-ts';
import axios from "axios";
import type { ShopBaseStorage } from "../window";
import { env } from "../types";

let shopBaseInfoCache = null

const mapShopIdUserId = {}
export const mapHiveEnv = {
    [env.dev]: 'https://hive.dev.shopbase.net',
    [env.stag]: 'https://hive.stag.shopbase.net',
    [env.prod]: 'https://hive.shopbase.com',
}

function shopBaseInfo(): Promise<ShopBaseStorage> {
    if (shopBaseInfoCache) return shopBaseInfoCache
    return browser.tabs
        .query({active: true, currentWindow: true})
        .then(([currentTab]) =>
            browser.tabs.executeScript(currentTab.id, {code: `localStorage['spotlight-ext-sbase']`}),
        ).then(([stateString]) => JSON.parse(stateString))
        .then((info) => {
            if (info.userId && info.shopId) {
                mapShopIdUserId[info.shopId] = info.userId
            }
            shopBaseInfoCache = info
            return info
        }).catch(err => {
            console.log('shopBaseInfo', err);
        })
}


const sessIDHive = async function () {
    return browser.cookies.get({
        url: mapHiveEnv[(await shopBaseInfo()).env],
        name: 'PHPSESSID',
    });
};

const regexUserId = /.*\/shopuser\/(\d+)\/show.*/;

async function getUserIdFromShopId(shopId: number): Promise<Number> {
    if (mapShopIdUserId[shopId]) return mapShopIdUserId[shopId]
    const linkHive = mapHiveEnv[(await shopBaseInfo()).env];
    const getUser = await axios.get(`${linkHive}/admin/app/shop/${shopId}/show`, {
        headers: {
            Cookie: `PHPSESSID=${await sessIDHive()}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const lastIndexUrlLogin = getUser.request.responseURL.lastIndexOf('/admin/login')
    if (lastIndexUrlLogin !== -1) {
        const domain = getUser.request.responseURL.substr(0, lastIndexUrlLogin)
        await browser.tabs.create({url: `${domain}/connect/google`});
    }

    const rs = getUser.data.match(regexUserId);

    if (!rs || !rs[1]) {
        throw new Error('Cannot detect owner id');
    }
    mapShopIdUserId[shopId] = rs[1]
    return rs[1]
}

function injectScript(file, node) {
    const th = document.getElementsByTagName(node)[0];
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.setAttribute('src', file);
    th.appendChild(scriptElement);
}

function backgroundFunction() {
    injectScript(chrome.runtime.getURL('window.js'), 'body');
}

export { shopBaseInfo, sessIDHive, getUserIdFromShopId, backgroundFunction };