<script>
  import { getContext, tick, afterUpdate } from 'svelte';
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { capitalize } from '../scripts/utils.js';
  import { scroll, initializeScrollBehavior } from '../scripts/scroll.js';
  import Divider from './Divider.svelte';
  import ListItem from './ListItem.svelte';
  import Pane from '../components/Pane.svelte';
  import Spinner from '../components/Spinner.svelte';

  export let shoppingListRef;
  export let loading;
  export let column;
  export let current;
  export let foods;
  export let updateFoods;
  export let update;
  export let send;
  export let receive;

  let list = { children: [] };
  let handleScroll;
  const { setModalContent } = getContext('MODAL');

  function openDivider(food) {
    const close = async (food) => {
      shoppingListRef.doc(food.id)
        .update({ need: food.need, have: food.have })
        .catch(error => console.error('Error updating shopping list:', error));

      let newFoods = foods.filter(f => f.id !== food.id).concat(food);
      updateFoods(newFoods);
      await tick();
      update(food);
    }
    setModalContent({
      component: Divider,
      props: { food, foods, close }
    })
  }

  function move(food) {
    const oppositeColumn = column === 'have' ? 'need' : 'have';
    const inBothColumns = food.need > 0 && food.have > 0;
    food[oppositeColumn] = food.total;
    food[column] = 0;

    shoppingListRef.doc(food.id)
      .update({ need: food.need, have: food.have })
      .catch(error => console.error('Error updating shopping list:', error));

    updateFoods(foods.filter(f => f !== food).concat(food));
    if (inBothColumns) {
      update(food);
    }
    handleScroll({ target: list })
  }

  afterUpdate(() => {
    handleScroll = initializeScrollBehavior(
      list,
      column === 'need' ? 'var(--dark-border)' : 'var(--light-border)'
    );
  });
</script>


<div
  class={column}
  class:two-column={current === column}
  in:fly={{ x: column === 'need' ? -300 : 300, duration: 300 }}>
  <h3>{capitalize(column)}</h3>
  {#if loading}
    <Spinner />
  {:else}
    <div
      class='column-list'
      bind:this={list}
      on:scroll={e => handleScroll(e)}>
      {#each foods.filter(t => t[column]) as food (food.id)}
        <label
          class={food.id}
          in:receive|local={{ key: food.id }}
          out:send|local={{ key: food.id }}
          animate:flip={{ duration: 300 }}>
          <Pane theme={column === 'have' && 'LIGHT'}>
            <ListItem 
              {column}
              {food}
              {move}
              {openDivider} />
          </Pane>
        </label>
      {/each}
    </div>
  {/if}
</div>


<style>
  .need,
  .have {
    width: calc(50% - 1rem);
    margin: 0 0.5rem;
    transition: width 0.3s;
  }
  .two-column {
    width: 100%;
    margin: 0;
  }
  h3 {
    margin-bottom: 0.5rem;
  }
  .column-list {
    border-radius: 2px;
    height: calc(100vh - var(--navbar-height) - 10rem);
    overflow: scroll;
  }
  label {
    position: relative;
    user-select: none;
  }
</style>