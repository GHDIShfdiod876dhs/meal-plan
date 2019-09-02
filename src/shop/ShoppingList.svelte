<script>
  import Wrapper from '../components/Wrapper.svelte';
  import Columns from './Columns.svelte';
  import { capitalize } from '../scripts/utils.js';

  const state = {
    buttons: ['All', 'need', 'have'],
    current: 'All'
  };
</script>

<Wrapper>
  <div class='buttons has-addons'>
    {#each state.buttons as button}
      <button
        class='button {state.current === button ? 'is-link' : 'not-selected'}'
        on:click={e => {
          state.current = button;
          e.target.blur();
        }}>
        {capitalize(button)}
      </button>
    {/each}
  </div>

  <Columns {...state} />
</Wrapper>


<style>
  .buttons {
    display: flex;
    justify-content: center;
    padding: 1rem;
  }
  .not-selected {
    border: 1px solid hsl(240, 8%, 90%);
    background-color: hsl(240, 8%, 98%);
  }
  .not-selected:hover {
    border: 1px solid hsl(240, 8%, 70%);
    background-color: hsl(240, 8%, 93%);
  }
</style>
