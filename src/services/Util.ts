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

export async function keepSession(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(['_isKeepSession'], ({_isKeepSession}) => {
            chrome.storage.local.set({_isKeepSession: true, _userId: key});
            !_isKeepSession && chrome.alarms.create({delayInMinutes: 5});
            resolve('done')
        });
    })
}

export async function getCache(key): Promise<any> {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], (mapData) => {
            resolve(mapData[key])
        });
    })
}