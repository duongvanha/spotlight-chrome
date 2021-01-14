<script lang='ts'>
  import '../services/shopBaseService';
  import SuggestionService from '../services/SuggestionService';
  import plugins from '../plugins';

  const suggestionService = new SuggestionService();
  import { suggestions as suggestionsData } from '../services/suggestionCache';

  suggestionsData.then(state => {
    suggestionService.setState(state);
    suggestionService.commit('foo -bar -bar1');
  }).catch(console.log);

  let suggestions = '';

  function search(event) {
    suggestions = suggestionService.get(event.target.value);
  }


</script>

<style lang='sass'>
  @import "Popup"
</style>

<div class='static-cLauncher cLauncher'>
  <div class='cLauncher__search-input-wrapper'>
    <input type='text' class='cLauncher__search'
           on:input={search} autofocus
           placeholder='Enter Your Command 123' />
    <p>{suggestions}</p>
  </div>
  <div class='cLauncher__suggestions-wrapper'>
    <ul class='cLauncher__suggestions cLauncher__scrollbar'>
      {#each plugins as plugin, i}
        <li class={'cLauncher__suggestion '}>
          <img class="cLauncher__suggestion-icon" src={plugin.icon}/>
          <div class="cLauncher__suggestion-title-info">
            <div class="cLauncher__suggestion-title dont-break-out">
              {plugin.title}
            </div>
            <div class="cLauncher__suggestion-subtitle dont-break-out">
              {plugin.subtitle}
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>