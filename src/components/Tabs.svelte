<script>
  import { capitalize } from '../scripts/utils.js';

  export let tabs;

  let active = tabs[0];
  let indicator;

  async function setActive(idx) {
    active = tabs[idx];
    const offset = indicator.getBoundingClientRect().width;
    indicator.style.transform = `translateX(${offset * idx}px)`;
  }
</script>


<div class='wrapper' style={`--num-tabs: ${tabs.length}`}>
  {#each tabs as tab, i}
    <h3 
      class='tab {tab !== active ? 'inactive' : ''}'
      on:click={() => setActive(i)}>
      {capitalize(tab.header)}
    </h3>
  {/each}

  <div id='indicator' bind:this={indicator}/>

  <main>
    {#each tabs as tab}
      {#if tab === active}
        <svelte:component this={tab.component} data={tab}/>
      {/if}
    {/each}
  </main>
</div>


<style>
  .wrapper {
    --border-weight: 1px;
    --indicator-weight: 3px;
    display: grid;
    grid-template-columns: repeat(var(--num-tabs), 1fr);
    grid-template-rows: 3.5rem 0.25rem 1fr;
    max-width: var(--max-width);
    color: #333;
    height: 100%;
  }
  h3 {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .tab {
    margin: 0;
    width: 100%;
    padding: 0.5rem;
    text-align: center;
    border-bottom: var(--border-weight) solid hsl(240, 8%, 90%);
    cursor: default;
    align-self: center;
  }
  .tab.inactive {
    color: rgba(51, 51, 51, 0.5);
    transition: color 200ms, border-bottom 200ms;
    align-self: center;
  }
  .tab.inactive:hover {
    color: rgba(51, 51, 51, 0.7);
    border-image: linear-gradient(
        to left,
        hsl(240, 8%, 90%),
        hsl(240, 8%, 70%),
        hsl(240, 8%, 90%)
      )
      1;
  }
  #indicator {
    position: relative;
    top: calc(
      -1 * var(--indicator-weight) + (0.5 *
            (var(--indicator-weight) - var(--border-weight)))
    );
    width: 100%;
    height: var(--indicator-weight);
    z-index: 10;
    background: linear-gradient(
      to left,
      transparent,
      var(--blue-color),
      transparent
    );
    transition: transform 200ms ease-in-out;
  }
  main {
    grid-column: 1 / -1;
    grid-row: 3;
    padding-top: 1.5rem;
    justify-self: center;
    display: flex;
    flex-direction: column;
    min-width: 100%;
  }
</style>