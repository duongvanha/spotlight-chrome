let mapData = {}

self.addEventListener('install', function (event) {
    chrome.runtime.onMessage.addListener(
        function ({type, key, value}, sender, sendResponse) {
            switch (type) {
                case 'getCache':
                    sendResponse(mapData[key])
                    break
                case 'setCache':
                    mapData[key] = value
                    break
            }
        }
    );
});