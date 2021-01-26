import { browser } from 'webextension-polyfill-ts';

const suggestions = browser.storage.sync.get({ suggestions: null }).then(({ suggestions }) => suggestions || {});

const setSuggestions = (suggestions) => browser.storage.sync.set({ suggestions });

export { suggestions, setSuggestions };