<script>
  import { tick } from 'svelte';

  export let item;
  export let idx;
  export let setItemToEdit;
  export let removeIngredient;

  let { id, amount, ingredient, prep } = item;

  const startEdit = () => setItemToEdit({ idx, ...item });
  const remove = () => removeIngredient(item);
</script>

<span class='outer-wrapper'>
  <div class='listItem'>
    <span>{amount} - {ingredient.food_name}{#if prep}{`, ${prep}`}{/if}</span>
  </div>

  <span class='controls-wrapper'>
    <span class='edit-button' on:click={startEdit}>✏️</span>
    <span on:click={remove}>🗑️</span>
  </span>
</span>


<style>
  .outer-wrapper {
    display: grid;
    grid-template-columns: 9fr 1fr;
  }
  .listItem {
    margin: 0.5rem;
    padding: 0.5rem;
    display: inline-flex;
    align-items: center;
  }
  .controls-wrapper {
    cursor: default;
    padding: 0;
    margin: 0;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    min-height: 100%;
    width: 5rem;
    min-width: 5rem;
    border-left: 1px solid hsl(240, 8%, 70%);
  }
  @media only screen and (max-width: 400px) {
    .controls-wrapper {
      width: 3rem;
      min-width: 3rem;
      padding: 1rem;
    }
    .edit-button {
      margin-bottom: 1rem;
    }
  }
</style>
