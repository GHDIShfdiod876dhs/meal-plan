<script>
  import { slide } from 'svelte/transition';
  import Pane from '../../components/Pane.svelte';

  export let expandable = false;
  export let title;
  export let nutritionDetails;

  let detailsVisible = false;
  const toggleDetailsVisible = () => detailsVisible = !detailsVisible;
</script>

<Pane theme='LIGHT'>
  <h4>{title}</h4>
  <div class='table'>
    {#each nutritionDetails as item}
      <div class='table-row'>
        <span class='cell'>{item.nutrient}</span>
        <span></span>
        <span class='cell'>
          {#if item.value === undefined}
            -
          {:else}
            {item.value.toFixed(1)}
          {/if}
        </span>
        <span class='cell'>{item.unit || ''}</span>
      </div>
      {#if detailsVisible && item.sublist.length}
        <div class='detail' transition:slide={{ duration: 300 }}>
          {#each item.sublist as subitem}
            <div class='table-row'>
              <span class='detail-nutrient cell'>{subitem.nutrient}</span>
              <span></span>
              <span class='cell'>
                {#if subitem.value === undefined}
                  -
                {:else}
                  {subitem.value.toFixed(1)}
                {/if}
              </span>
              <span class='cell'>{subitem.unit || ''}</span>
            </div>
          {/each}
        </div>
      {/if}
    {/each}
  </div>
  {#if expandable}
    <div class='button-container'>
      <button
        on:click={toggleDetailsVisible}>
        {#if detailsVisible}
          Show less
        {:else}
          Show more
        {/if}
      </button>
    </div>
  {/if}
</Pane>


<style>
  h4 {
    text-align: center;
  }
  .table {
    width: 100%;
  }
  .table-row {
    display: grid;
    grid-template-columns: 1fr auto min-content 2rem;
    background-color: var(--light-bg);
    border-bottom: var(--dark-border);
  }
  .cell {
    text-align: right;
  }
  .cell:first-child {
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .cell:nth-child(2) {
    padding-right: 0.5rem;
  }
  .detail-nutrient {
    padding-left: 1rem;
  }
  .button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: -1rem;
  }
  button {
    margin: 0;
  }
</style>