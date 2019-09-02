<script>
  import { nutritionixHeaders } from '../../keys.js';
  import { capitalize } from '../../scripts/utils.js';
  import conversions from '../../scripts/conversions.js';
  import { tick } from 'svelte';
  import Spinner from '../../components/Spinner.svelte';

  export let addIngredient;
  export let editIngredient;
  export let idx, id, amount, ingredient, prep;
  export let setItemToEdit;
  export let resetItemToEdit;

  let query = '';
  let queryInput;
  let data = [];
  let loading = false;
  let invalidAmountNumber = false;
  let invalidAmountUnit = false;
  let invalidAmountIngredient = null;

  function clearQuery() {
     query = '';
     data = [];
  }

  function autocomplete() {
    if (query) {
      fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${query}`,{
        headers: nutritionixHeaders
      })
      .then(res => res.json())
      .then(json => {
        const { common } = json;
        data = common;
      })
      .catch(err => console.log(err));
    }
  }

  function selectFood(idx) {
    const food_name = data[idx].food_name;
    fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
      method: 'post',
      body: JSON.stringify({ query: food_name }),
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': 'a420ce36',
        'x-app-key':'abbe295df948b00469c8291944b40a56'
      }
    })
    .then(res => res.json())
    .then(({ foods }) => ingredient = foods[0])
    .then(() => console.log(ingredient))
    .catch(err => console.log(err));
    clearQuery();
  }

  async function changeIngredient() {
    query = ingredient.food_name;
    console.log(query);
    ingredient = null;
    await tick();
    console.log(queryInput)
    queryInput.focus();
  }

  function clearAll() {
    ingredient = '';
    prep = '';
    amount = '';
    idx = null;
    resetItemToEdit();
    clearQuery();
  }

  function handleSubmit() {
    if (!ingredient) {
      return;
    }
    // validate amount
    const number = parseFloat(amount);
    if (isNaN(number)) {
      invalidAmountNumber = true;
      invalidAmountIngredient = ingredient;
      return;
    }
    const unit = amount.match(/[a-zA-Z]+(?: [a-zA-Z]+)?/)[0].toLowerCase();
    const cupIdx = ingredient.alt_measures.findIndex(m => m.measure.toLowerCase() === 'cup');
    let unitIdx = ingredient.alt_measures.findIndex(m => m.measure === unit);
    if (unitIdx === -1) {
      unitIdx = ingredient.alt_measures.findIndex(m => m.measure.includes(unit))
    }
    if (unitIdx === -1
      && !(unit in conversions.mass)
      && !(unit in conversions.volume)
      || unit in conversions.volume
      && cupIdx === -1) {
        invalidAmountUnit = unit;
        invalidAmountIngredient = ingredient;
        return;
    }

    loading = true;
    const cb = () => loading = false;
    amount = `${number} ${unit}`;
    invalidAmountNumber = false;
    invalidAmountUnit = false;
    invalidAmountIngredient = null;
    if (idx !== null) {
      editIngredient({ id, amount, ingredient, prep }, cb);
    } else {
      addIngredient({ amount, ingredient, prep }, cb);
    }
    clearAll();
  }
</script>


<div class='wrapper'>
  <h3>Prep/Ingredients:</h3>
  <form on:submit|preventDefault={handleSubmit}>
    <div class='field has-addons'>
      <div class="control">
        <input
          type='text'
          class='input amount-input'
          placeholder='Amt.'
          bind:value={amount}>
        <!-- todo: prettify unit -->
      </div>

      <div class="control">
      {#if ingredient}
        <div
          class='ingredient-input input'
          on:click={changeIngredient}>
          {ingredient.food_name}
        </div>
      {:else}
        <input
          type='text'
          class='input ingredient-input'
          placeholder='Ingredient'
          bind:value={query}
          bind:this={queryInput}
          on:input={autocomplete}
          on:blur={clearQuery}>
      {/if}
      </div>

      {#if data.length > 0}
        <ul class='list'>
          {#each data as food, idx}
            <li
              class='list-item'
              on:mousedown={() => selectFood(idx)}
              on:touchstart={() => selectFood(idx)}>
              {food.food_name}
            </li>
          {/each}
        </ul>
      {/if}

      <div class="control">
        <input
          class='input prep-input'
          type='text'
          placeholder='Prep'
          bind:value={prep} />
      </div>

      <div class='control'>
        <button class='button' type='submit'>
          {#if loading}
            <Spinner />
          {:else}
            Save
          {/if}
        </button>
      </div>
    </div>

    <div class='invalid'>
      {#if invalidAmountNumber}Amount must contain a number{/if}
      {#if invalidAmountUnit}
        Sorry, the database doesn't have an entry for "{invalidAmountIngredient.food_name}" with the unit "{invalidAmountUnit}." Consider using:
        <ul>
          {#each invalidAmountIngredient.alt_measures as alt_measure}
            <li>{alt_measure.measure}</li>
          {/each}
        </ul>
      {/if}
    </div>
  </form>
</div>


<style>
  .wrapper:last-of-type {
    margin-top: 3rem;
  }
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 1rem;
    position: relative;
  }
  .field.has-addons {
    margin-bottom: 1rem;
  }
  input:active,
  input:hover {
    z-index: 2;
  }
  .amount-input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    flex-grow: 2;
  }
  .ingredient-input,
  .prep-input {
    border-radius: 0;
    flex-grow: 5;
  }
  div.ingredient-input {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .list {
    position: absolute;
    top: 5rem;
    max-height: 12rem;
    overflow-y: scroll;
    z-index: 1000;
    width: 100%;
    max-width: var(--max-width);
  }
  .list-item {
    margin: 0;
  }
  .list-item:hover {
    background:  hsl(217, 71%, 53%);
    color: white;
  }
  .button {
    width: 3.75rem;
  }
  .invalid {
    color: red;
    font-style: italic;
    font-size: 0.75rem;
    margin-top: -1rem;
    margin-bottom: 1rem;
  }
  .invalid li {
    text-indent: 1rem;
  }
</style>
