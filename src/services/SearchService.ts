import fuzzaldrinPlus from 'fuzzaldrin-plus/lib/fuzzaldrin.js'

import type AdapterPlugin from '../plugins/interface';
import plugins from "../plugins";


function Search(keyword: string): AdapterPlugin[] {
    return fuzzaldrinPlus
        .filter(plugins, keyword, {key: 'subtitle', maxResults: 5})
        .map((matchedResult) => {
            matchedResult.textWithMatchedChars = fuzzaldrinPlus.wrap(matchedResult.subtitle, keyword)
            return matchedResult
        })
}

export default Search
