<script>
  import { menu } from '../menu/menu.js'

  export let dayIdx;
  export let meals;
  export let meal;
  export let removeMeal;
  export let updateServingsForMeal;
  export let updateServingsForRecipe;

  let servings = meal.servings;
  let prevServingsLocal = servings;
  let prevServingsDB = servings;
  
  function handleInput() {
    const diff = servings - prevServingsLocal;
    prevServingsLocal = servings;
    menu.updateServingsForRecipe(meal.id, diff);
    meals.updateServingsForMeal(meal.id, servings, dayIdx);
  }

  function handleChange() {
    const diff = servings - prevServingsDB;
    prevServingsDB = servings;
    // todo: make this a batched write 
    updateServingsForMeal(meal.id, servings);
    updateServingsForRecipe(meal.id, diff);
  }

  function handleRemove() {
    removeMeal(meal)
  }

</script>


<div class='wrapper'>
  <div class='top-line'>
    <span>{meal.name}</span>
    <span class='remove-meal' on:click={handleRemove}>🗑</span>
  </div>
  <input 
    type='range'
    min='0'
    max='8'
    step='0.125'
    bind:value={servings}
    on:input={handleInput}
    on:change={handleChange}>
  <div class='servings'>{servings}</div>
</div>


<style>
  .wrapper {
    box-shadow: var(--shadow);
    margin-bottom: 0.5rem;
    padding: 0.25rem;
    background: var(--light-bg);
    border-radius: 2px;
  }
  .top-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.25rem 0;
  }
  .remove-meal,
  .servings {
    font-size: 0.75rem;
  }
  input[type='range'] {
    width: 100%;
    height: auto;
    margin: 0;
    padding: 0;
  }
  .servings {
    text-align: right;
  }
</style>