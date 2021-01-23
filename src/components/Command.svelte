<script lang='ts'>
    import '../services/shopBaseService';
    import SuggestionService from '../services/SuggestionService';

    const suggestionService = new SuggestionService();
    import { suggestions as suggestionsData } from '../services/suggestionCache';
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
        error = null
        loading = true
        try {
            const [_, ...params] = keyword.split('-').map(i => i.trim())
            message = await execute(pluginSelected, ...params)
            suggestionService.commit(keyword)
        } catch (e) {
            error = e
        }
        loading = false
    }

    function handleKeyup(event) {
        if (!['Enter', 'Tab'].includes(event.code)) return
        event.preventDefault()
        switch (event.code) {
            case 'Enter':
                return executeCurrent()
            case 'Tab': {
                const rs = suggestionService.get(keyword)
                if (rs.length > keyword.length) {
                    keyword = rs
                } else {
                    if (pluginSelected) {
                        keyword = pluginSelected.title
                    }
                }
            }
        }
    }
</script>

<style lang='sass'>
  @import "Popup"
</style>

<div class='static-cLauncher cLauncher'>
    <div class='cLauncher__search-input-wrapper'>
        <input type='text' class='cLauncher__search' bind:value={keyword} autofocus on:keydown={handleKeyup}
               placeholder='Enter Your Command 123'/>
        <p>{suggestions}</p>
        {#if pluginSelected}
            <p>{pluginSelected.hint}</p>
        {/if}
        {#if error != null}
            <p>{error.message}</p>
        {/if}
    </div>
    <div class='cLauncher__suggestions-wrapper'>
        <ul class='cLauncher__suggestions cLauncher__scrollbar'>
            {#each plugins as plugin, i}
                <li class={'cLauncher__suggestion'}
                    class:selected="{pluginSelected && pluginSelected.id === plugin.id}"
                    class:loading="{loading}"
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
</div>