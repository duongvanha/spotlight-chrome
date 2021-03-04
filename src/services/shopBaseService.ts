import { browser } from 'webextension-polyfill-ts';
import axios from 'axios';
import type { ShopBaseStorage } from '../window';
import { Env } from '../types';
import { getCache, keepSession, setCache } from "./Util";

let shopBaseInfoCache = null

enum CacheKey {
    shopInfo
}

export type ShopInfo = {
    shopId: number
    ownerId: number,
    publicDomain: string,
    shopBaseDomain: string,
}

export const mapHiveEnv = {
    [Env.dev]: 'https://hive.dev.shopbase.net',
    [Env.stag]: 'https://hive.stag.shopbase.net',
    [Env.prod]: 'https://hive.shopbase.com',
}

const mapEnv = {
    dev: Env.dev,
    stag: Env.stag,
}

const regexOwnerId = /.*\/shopuser\/(\d+)\/show.*/;
const regexPublicDomain = /.*<th>Public Domain<\/th>\n<td>(.*)<\/td>.*/
const regexShopBaseDomain = /.*<th>Domain<\/th>\n<td>(.*)<\/td>.*/


function shopBaseInfo(): Promise<ShopBaseStorage> {
    if (shopBaseInfoCache) return shopBaseInfoCache
    return browser.tabs
        .query({active: true, currentWindow: true})
        .then(([currentTab]) =>
            browser.tabs.executeScript(currentTab.id, {code: `localStorage['spotlight-ext-sbase']`}),
        ).then(([stateString]) => JSON.parse(stateString))
        .then((info) => {
            shopBaseInfoCache = info
            return info
        }).catch(err => {
            console.log('shopBaseInfo', err.message);
        })
}

async function sessIDHive(env) {
    return browser.cookies.get({
        url: mapHiveEnv[env],
        name: 'PHPSESSID',
    });
}

export async function detectEnv(envParams): Promise<Env> {

    let env = mapEnv[envParams]

    if (!envParams) {
        const sbInfo = await shopBaseInfo()
        if (sbInfo) {
            env = sbInfo.env
        }
    }

    if (env === undefined || env === null) {
        env = Env.prod
    }

    return env
}

async function getShopBaseInfo(shopId: number, env): Promise<ShopInfo> {
    const cacheKey = `${CacheKey.shopInfo}${shopId}${env}`
    const rs = await getCache(cacheKey)

    if (rs) return rs

    const linkHive = mapHiveEnv[env];
    const session = await sessIDHive(env)
    const shopRes = await axios.get(`${linkHive}/admin/app/shop/${shopId}/show`, {
        headers: {
            Cookie: `PHPSESSID=${session}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const lastIndexUrlLogin = shopRes.request.responseURL.lastIndexOf('/admin/login')
    if (lastIndexUrlLogin !== -1) {
        const domain = shopRes.request.responseURL.substr(0, lastIndexUrlLogin)
        await browser.tabs.create({url: `${domain}/connect/google`, active: false});
        throw new Error('Invalid permissions, please login in the next tab and try again');
    }

    let publicDomainRex = regexPublicDomain.exec(shopRes.data)
    if (!publicDomainRex || !publicDomainRex[1]) {
        throw new Error('Cannot detect public domain');
    }
    let ownerIdRex = regexOwnerId.exec(shopRes.data)
    if (!ownerIdRex || !ownerIdRex[1] || +ownerIdRex[1] === 0) {
        throw Error('Cannot detect owner id');
    }
    let shopBaseDomainRex = regexShopBaseDomain.exec(shopRes.data)
    if (!shopBaseDomainRex || !shopBaseDomainRex[1]) {
        throw new Error('Cannot detect public domain');
    }

    const shopInfo = {
        publicDomain: publicDomainRex[1],
        ownerId: +ownerIdRex[1],
        shopBaseDomain: shopBaseDomainRex[1],
        shopId: shopId
    }

    setCache(cacheKey, shopInfo)
    keepSession(session)

    return shopInfo
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

export { shopBaseInfo, sessIDHive, backgroundFunction, getShopBaseInfo };