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
    return new Promise((resolve, reject) => {

        chrome.runtime.sendMessage({key, value, type: "setCache"}, function (response) {
            console.log(response);
            resolve(response)
        });
    })
}

export async function getCache(key): Promise<any> {
    return new Promise((resolve, reject) => {

        chrome.runtime.sendMessage({key, type: "getCache"}, function (response) {
            console.log(response);
            resolve(response)
        });
    })
}