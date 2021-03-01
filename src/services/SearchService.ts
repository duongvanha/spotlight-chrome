import fuzzaldrinPlus from 'fuzzaldrin-plus/lib/fuzzaldrin.js'

import type AdapterPlugin from '../plugins/interface';
import plugins from "../plugins";


export default async function Search(keyword: string): Promise<AdapterPlugin[]> {
    if (keyword === ' ') return plugins
    const [keywordSearch, ...params] = keyword.split('-')
    return fuzzaldrinPlus
        .filter(plugins, keywordSearch, {key: 'subtitle', maxResults: 20})
        .map((matchedResult) => ({
            ...matchedResult,
            subtitle: fuzzaldrinPlus.wrap(matchedResult.subtitle, keywordSearch),
        }))
}
