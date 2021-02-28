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
    let shortCodeOpenExtensions = ['⌘', 'J']

    chrome.runtime.getPlatformInfo(function (info) {
        switch (info.os) {
            case 'win':
                shortCodeOpenExtensions = ['Ctrl', 'J'];
                break
            case 'linux':
                shortCodeOpenExtensions = ['Ctrl', 'M'];
                break
        }
    });

    let keyword = '';
    let suggestions: string;

    let error = null
    let message = ''
    let loading = false;
    let plugins: AdapterPlugin[]
    let pluginSelected = null

    $: changeData(keyword)

    async function changeData(value) {
        keyword = value
        error = null
        suggestions = suggestionService.get(keyword);
        if (keyword.startsWith(suggestions)) {
            suggestions = ''
        }
        plugins = await Search(keyword)
        if (plugins.length > 0) {
            pluginSelected = plugins[0]
        } else {
            pluginSelected = null
        }
    }

    async function executeCurrent() {
        if (!pluginSelected) return
        error = null
        message = ''
        loading = true
        try {
            const [_, ...params] = keyword.split('-').map(i => i.trim())
            message = await execute(pluginSelected, ...params)
            suggestionService.commit(keyword)
            await setSuggestions(suggestionService.getState())
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
<div style="flex: 1 1 0; overflow: hidden; display: flex; flex-direction: column; min-width: 350px">
    <div style="position: relative;display: flex; align-items: center; border: none; padding: 0 16px; width: 100%; background: transparent; font-size: 18px; line-height: inherit; height: 52px; flex-grow: 0; flex-shrink: 0; z-index: 1; box-shadow: rgba(55, 53, 47, 0.09) 0 1px 0;">
        <svg viewBox="0 0 17 17"
             style="width: 18px; height: 18px; display: block; fill: rgba(55, 53, 47, 0.4); flex-shrink: 0; backface-visibility: hidden; margin-right: 10px; flex-grow: 0;">
            <path d="M6.78027 13.6729C8.24805 13.6729 9.60156 13.1982 10.709 12.4072L14.875 16.5732C15.0684 16.7666 15.3232 16.8633 15.5957 16.8633C16.167 16.8633 16.5713 16.4238 16.5713 15.8613C16.5713 15.5977 16.4834 15.3516 16.29 15.1582L12.1504 11.0098C13.0205 9.86719 13.5391 8.45215 13.5391 6.91406C13.5391 3.19629 10.498 0.155273 6.78027 0.155273C3.0625 0.155273 0.0214844 3.19629 0.0214844 6.91406C0.0214844 10.6318 3.0625 13.6729 6.78027 13.6729ZM6.78027 12.2139C3.87988 12.2139 1.48047 9.81445 1.48047 6.91406C1.48047 4.01367 3.87988 1.61426 6.78027 1.61426C9.68066 1.61426 12.0801 4.01367 12.0801 6.91406C12.0801 9.81445 9.68066 12.2139 6.78027 12.2139Z"></path>
        </svg>
        <input bind:value={keyword} autofocus
               placeholder="{suggestions ? '' : 'Search...'}" type="text" class="input-search">
        {#if suggestions}
            <input type='text' class="input-search suggestion" disabled value={suggestions}>
        {/if}
        <div role="button"
             style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; flex-shrink: 0; flex-grow: 0; border-radius: 20px; margin-left: 8px;">
            <svg viewBox="0 0 30 30"
                 style="width: 14px; height: 14px; display: block; fill: rgba(55, 53, 47, 0.3); flex-shrink: 0; backface-visibility: hidden;">
                <path d="M15,0C6.716,0,0,6.716,0,15s6.716,15,15,15s15-6.716,15-15S23.284,0,15,0z M22,20.6L20.6,22L15,16.4L9.4,22L8,20.6l5.6-5.6 L8,9.4L9.4,8l5.6,5.6L20.6,8L22,9.4L16.4,15L22,20.6z"></path>
            </svg>
        </div>
    </div>
    {#if error != null}
        <div style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 0; font-size: 14px; box-shadow: rgba(55, 53, 47, 0.06) 0px 1px 0px;">
            <div style="margin-left: 14px; margin-right: 14px; min-width: 0;">
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    <div style="display: flex; align-items: center; height: 32px;">
                        <div style="margin-right: 2px; color: rgba(55, 53, 47, 0.4); font-size: 12px; transform: translateY(0.5px);">
                            Error:
                        </div>
                        <div role="button" class="result-message error">
                            <div>{error.message}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else if message}
        <div style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 0; font-size: 14px; box-shadow: rgba(55, 53, 47, 0.06) 0px 1px 0px;">
            <div style="margin-left: 14px; margin-right: 14px; min-width: 0;">
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    <div style="display: flex; align-items: center; height: 32px;">
                        <div style="margin-right: 2px; color: rgba(55, 53, 47, 0.4); font-size: 12px; transform: translateY(0.5px);">
                            Result:
                        </div>
                        <div role="button" class="result-message success">
                            <div>{message}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else if pluginSelected}
        <div style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 0; font-size: 14px; box-shadow: rgba(55, 53, 47, 0.06) 0px 1px 0px;">
            <div style="margin-left: 14px; margin-right: 14px; min-width: 0;">
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    <div style="display: flex; align-items: center; height: 32px;">
                        <div style="margin-right: 2px; color: rgba(55, 53, 47, 0.4); font-size: 12px; transform: translateY(0.5px);">
                            Hint:
                        </div>
                        <div role="button" class="result-message">
                            <div>{pluginSelected.hint || ''}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    {#if plugins && plugins.length}
        <section style="flex: 1 1 0%; display: flex; flex-direction: column; overflow: auto; height: 100%;">
            {#each plugins as plugin}
                <div class:selected={pluginSelected && pluginSelected === plugin}
                     class:loading={loading} role="button" class="plugin">
                    <div style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 36px; font-size: 14px; padding-top: 8px; padding-bottom: 8px; box-shadow: rgba(55, 53, 47, 0.06) 0px 1px 0px;">
                        <div style="display: flex; align-items: center; justify-content: center; margin-left: 14px; margin-top: 1px; align-self: flex-start;">
                            <div role="button" aria-disabled="true"
                                 style="user-select: none; transition: background 20ms ease-in 0s; display: flex; align-items: center; justify-content: center; height: 19px; width: 19px; border-radius: 3px; flex-shrink: 0;">
                                <div style="display: flex; align-items: center; justify-content: center; height: 19px; width: 19px;">
                                    <div style="height: 17.1px; width: 17.1px; font-size: 17.1px; line-height: 1.1; margin-left: 0px; color: black;">
                                        <span class="span-icon">{plugin.icon}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="margin-left: 8px; margin-right: 14px; min-width: 0px;">
                            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; line-height: 20px; color: rgba(55, 53, 47, 0.6);">
                                    {plugin.title}
                                </div>
                            </div>
                            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgba(55, 53, 47, 0.6); margin-top: 1px; font-size: 12px;">
                                <div style="display: flex; font-size: 12px; color: rgba(55, 53, 47, 0.4); overflow: hidden;">
                                    <div
                                            style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px; color: rgba(55, 53, 47, 0.4);">
                                        <div contenteditable="true" bind:innerHTML={plugin.subtitle}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="icon-enter">
                            <svg viewBox="0 0 14 12">
                                <path d="M4.45869 11.0605C4.83955 11.0605 5.09736 10.791 5.09736 10.4219C5.09736 10.2285 5.02119 10.0879 4.904 9.9707L3.41572 8.51758L2.39033 7.65625L3.74384 7.71484H11.0563C12.527 7.71484 13.154 7.05273 13.154 5.59961V2.125C13.154 0.654297 12.527 0.0214844 11.0563 0.0214844H7.80439C7.41181 0.0214844 7.13642 0.314453 7.13642 0.677734C7.13642 1.03516 7.41181 1.32812 7.79853 1.32812H11.027C11.613 1.32812 11.8649 1.58008 11.8649 2.16602V5.55859C11.8649 6.16211 11.613 6.4082 11.027 6.4082H3.74384L2.39033 6.47266L3.41572 5.60547L4.904 4.1582C5.02119 4.04102 5.09736 3.89453 5.09736 3.70117C5.09736 3.33789 4.83955 3.06836 4.45869 3.06836C4.29462 3.06836 4.11298 3.14453 3.98408 3.27344L0.626656 6.57812C0.49189 6.70703 0.421577 6.88281 0.421577 7.06445C0.421577 7.24023 0.49189 7.41602 0.626656 7.54492L3.98408 10.8555C4.11298 10.9844 4.29462 11.0605 4.45869 11.0605Z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            {/each}
        </section>
    {/if}
    <footer style="flex-shrink: 0;">
        <div style="box-shadow: rgba(55, 53, 47, 0.09) 0px -1px 0px; margin-top: 1px; display: flex; flex-direction: row; justify-content: space-between; align-items: center; font-size: 14px;">
            <div style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 28px; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgba(55, 53, 47, 0.4);">
                <div style="margin-left: 14px; margin-right: 14px; min-width: 0px; flex: 1 1 auto;">
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        <ul style="list-style-type: none; padding: 0px; margin: 0px; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgba(55, 53, 47, 0.4);">
                            <li style="display: inline; margin-right: 16px;"><span
                                    style="margin-right: 4px; margin-bottom: 1px; font-variant: all-small-caps; font-size: 13.2px; color: rgba(55, 53, 47, 0.6);">↹</span>Complete
                            </li>
                            <li style="display: inline; margin-right: 16px;"><span
                                    style="margin-right: 4px; margin-bottom: 1px; font-variant: all-small-caps; font-size: 13.2px; color: rgba(55, 53, 47, 0.6);">Enter</span>Execute
                            </li>
                            <li style="display: inline; margin-right: 16px;"><span
                                    style="font-size: 10.5px; color: rgba(55, 53, 47, 0.6);">{shortCodeOpenExtensions[0]}</span><span
                                    style="margin-right: 4px; margin-bottom: 1px; font-variant: all-small-caps; font-size: 13.2px; color: rgba(55, 53, 47, 0.6);">+{shortCodeOpenExtensions[1]}</span>Open
                                extension
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</div>