self.addEventListener('install', function (event) {});

chrome.runtime.onStartup.addListener(function () {
    chrome.storage.local.clear()
    chrome.alarms.clearAll()
});

chrome.alarms.onAlarm.addListener(async function () {
    console.log('tick');
    chrome.storage.local.get(['_userId'], async ({_userId}) => {
        console.log(_userId);
        if (!_userId) return
        const {status} = await fetch("https://keep-session.herokuapp.com/tick", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"user": _userId}) // body data type must match "Content-Type" header
        });
        if (status === 200) {
            chrome.alarms.create({delayInMinutes: 5});
        }
    })
});
