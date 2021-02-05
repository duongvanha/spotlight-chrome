<script lang='ts'>
    import '../services/shopBaseService';
    import SuggestionService from '../services/SuggestionService';

    const suggestionService = new SuggestionService();
    import { setSuggestions, suggestions as suggestionsData } from '../services/suggestionCache';
    import Search from '../services/SearchService';
    import execute from '../services/executeService';
    import type AdapterPlugin from "../plugins/interface";

    suggestionsData.then(state => {
        suggestionService.setState(state);
    }).catch((err) => error = err);

    let keyword = '';
    let suggestions: string;

    let error = null
    let message = ''
    let loading = false;
    let plugins: AdapterPlugin[]
    let pluginSelected = null

    $: {
        error = null
        suggestions = suggestionService.get(keyword);
        const keywordSearch = keyword.split('-')
        plugins = Search(keywordSearch.length > 0 ? keywordSearch[0] : keyword)
        if (plugins.length > 0) {
            pluginSelected = plugins[0]
        } else {
            pluginSelected = null
        }
    }

    async function executeCurrent() {
        if (!pluginSelected) return
        message = ''
        loading = true
        try {
            const [_, ...params] = keyword.split('-').map(i => i.trim())
            message = await execute(pluginSelected, ...params)
            suggestionService.commit(keyword)
            setSuggestions(suggestionService.getState())
        } catch (e) {
            error = e
        }
        loading = false
    }

    const eventsAccepted = new Set(['Enter', 'Tab', 'ArrowDown', 'ArrowUp'])

    document.addEventListener('keydown', handleKeyup);

    function handleKeyup(event) {
        if (!eventsAccepted.has(event.code)) return
        event.preventDefault()
        switch (event.code) {
            case 'Enter':
                return executeCurrent()
            case 'Tab': {
                const rs = suggestionService.get(keyword)
                if (rs.length > keyword.length) {
                    keyword = rs
                } else if (pluginSelected && pluginSelected.title.length > keyword.length) {
                    keyword = pluginSelected.title
                }
                break
            }
            case 'ArrowUp': {
                const index = plugins.indexOf(pluginSelected)
                pluginSelected = plugins[index - 1] || plugins[plugins.length - 1]
                break
            }
            case 'ArrowDown': {
                const index = plugins.indexOf(pluginSelected)
                pluginSelected = plugins[index + 1] || plugins[0]
                break
            }
        }
    }
</script>

<style lang='sass'>
  @import "Popup"
</style>

<div class='static-cLauncher cLauncher'>
    <div class='cLauncher__search-wrapper'>
        <div class="cLauncher__search-input-wrapper">
            <input type='text' class='cLauncher__search' bind:value={keyword} autofocus
                   placeholder="{suggestions ? '' : 'Enter Your Command'}"/>
            {#if suggestions}
                <input type='text' class="cLauncher__search suggestion" disabled value={suggestions}>
            {/if}
        </div>
        <div class='cLauncher__hint'>
            {#if error != null}
                <p class="error">{error.message}</p>
            {:else if message}
                <p class="result">{message}</p>
            {:else if pluginSelected}
                <p class="hint">{pluginSelected.hint}</p>
            {/if}
        </div>
    </div>
    {#if plugins && plugins.length}
        <div class='cLauncher__suggestions-wrapper'>
            <ul class='cLauncher__suggestions cLauncher__scrollbar'>
                {#each plugins as plugin}
                    <li class='cLauncher__suggestion'
                        class:selected={pluginSelected && pluginSelected === plugin}
                        class:loading={loading}
                    >
                        <img class="cLauncher__suggestion-icon" src={plugin.icon}/>
                        <div class="cLauncher__suggestion-title-info">
                            <div class="cLauncher__suggestion-title dont-break-out">
                                {plugin.title}
                            </div>
                            <div class="cLauncher__suggestion-subtitle dont-break-out"
                                 contenteditable="true"
                                 bind:innerHTML={plugin.textWithMatchedChars}>
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>