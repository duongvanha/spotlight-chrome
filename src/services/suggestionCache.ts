import { browser } from 'webextension-polyfill-ts';

const suggestions = browser.storage.sync.get({ suggestions: null }).then(({ suggestions }) => suggestions || {});

export { suggestions };