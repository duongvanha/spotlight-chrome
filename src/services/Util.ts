import { browser } from "webextension-polyfill-ts";

export function copyToClipboard(value) {
    document.addEventListener('copy', (event) => {
        // Prevents the default behavior of copying, ex: pressing Ctrl+C
        // If we didn't prevent the prevent default, the clipboard would be filled with what ever the user had highlighted on the page.
        event.preventDefault();
        event.clipboardData.setData('text/plain', value);
    }, {once: true})
    document.execCommand('copy');
}

export async function setCache(key, value) {
    chrome.storage.local.set({[key]: value})
    return value
}

export function executeScript(code: string, fun: Function) {
    return browser.tabs
        .query({active: true, currentWindow: true})
        .then(([currentTab]) => {
                if (browser.tabs.executeScript) {
                    return browser.tabs.executeScript(currentTab.id, {code: `localStorage['spotlight-ext-sbase']`}).then(([item]) => item)
                }
                return new Promise((resolve, _reject) => {
                    // @ts-ignore
                    return chrome.scripting.executeScript({
                        target: {tabId: currentTab.id},
                        function: fun
                    }, (info) => resolve(info[0].result))
                })
            }
        ).then((stateString) => JSON.parse(stateString))
}

export function base64Encode(val) {
    return btoa(encodeURI(val))
}

export function parseShopId(shopId: any): number {
    return Number(shopId.toString().replaceAll(',', ''))
}

export async function keepSession(key) {
    return new Promise((resolve) => {
        chrome.alarms.get(alarm => {
            chrome.storage.local.set({_userId: key});
            !alarm && chrome.alarms.create({delayInMinutes: 5});
            resolve('done')
        })
    })
}

export async function getCache(key): Promise<any> {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], (mapData) => {
            resolve(mapData[key])
        });
    })
}