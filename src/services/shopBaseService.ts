import { browser } from 'webextension-polyfill-ts';

const shopBaseInfo = browser.tabs
  .query({ active: true, currentWindow: true })
  .then(([currentTab]) =>
    browser.tabs.executeScript(currentTab.id, { code: `localStorage['spotlight-ext-sbase']` }),
  ).then(([stateString]) => JSON.parse(stateString)).catch(err => {
    console.log('shopBaseInfo', err);
  });


const sessIDHive = async function() {
  return browser.cookies.get({
    url: 'https://hive.shopbase.com',
    name: 'PHPSESSID',
  });
};

export { shopBaseInfo, sessIDHive };