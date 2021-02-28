import fuzzaldrinPlus from 'fuzzaldrin-plus/lib/fuzzaldrin.js'

import type AdapterPlugin from '../plugins/interface';
import plugins from "../plugins";


async function Search(keyword: string): Promise<AdapterPlugin[]> {
    const [keywordSearch, ...params] = keyword.split('-')
    const pluginMatched = fuzzaldrinPlus
        .filter(plugins, keywordSearch, {key: 'subtitle', maxResults: 20})
        .map((matchedResult) => ({
            ...matchedResult,
            subtitle: fuzzaldrinPlus.wrap(matchedResult.subtitle, keywordSearch),
        }))
    if (pluginMatched && pluginMatched.length === 1 && pluginMatched[0].search) {
        return pluginMatched[0].search(...params)
    }

    return pluginMatched
}

export default Search
