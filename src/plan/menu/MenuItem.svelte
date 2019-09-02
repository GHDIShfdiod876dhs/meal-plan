<script>
  import { getContext } from 'svelte';
  import { db } from '../../scripts/firebase.js';
  import { user } from '../../scripts/user.js';
  import { capitalize, formatNum } from '../../scripts/utils.js';
  import { menu } from './menu.js';
  import { push } from 'svelte-spa-router';
  import NutritionDetails from '../nutrition-details/NutritionDetails.svelte';

  export let recipe = {};
  const { name, nutritionData, servingsPerRecipe } = recipe;
  $: servings = recipe.servings;

  db.collection('plans')
    .doc($user.uid)
    .collection('currentWeekAggregate')
    .doc(recipe.id)
    .onSnapshot(snapshot => {
      const data = snapshot.data()
      menu.setServingsForRecipe(recipe.id, data ? data.servings : 0)
    });
  
  const modalCtx = getContext('MODAL');

  function openDetails() {
    modalCtx.setModalContent({
      component: NutritionDetails,
      props: {
        recipes: [recipe],
        header: recipe.name,
        isMenuItem: true
      },
    });
  }

  const edit = () => push(`/recipe/${recipe.id}`);

  const macros =
    recipe.nutritionData
    ? {
      kcal: formatNum(nutritionData[208] / servingsPerRecipe),
      carbs: formatNum(nutritionData[205] / servingsPerRecipe) + 'g',
      fats: formatNum(nutritionData[204] / servingsPerRecipe) + 'g',
      protein: formatNum(nutritionData[203] / servingsPerRecipe) + 'g',
      fiber: formatNum(nutritionData[291] / servingsPerRecipe) + 'g',
      }
    : {};
</script>

<div class='wrapper'>
  <div class='name'>
    <strong>{capitalize(name)}</strong>
    <span class='id'>___{recipe.id}___</span>
  </div>
  <div class='batches'>{servings || ''}</div>
  <div class='nutrition'>
    {#each Object.entries(macros) as [key, value]}
      <div>
        <div>{key}</div>
        <div>{value}</div>
      </div>
    {/each}
  </div>
  <div class='details' on:click={openDetails}>🔍</div>
  <div class='edit'on:click={edit}>✏️</div>
</div>


<style>
  .wrapper {
    display: grid;
    grid-template-areas: 'name      x       batches'
                         'nutrition details edit   ';
    grid-template-columns: 9fr 1fr 1fr;
    grid-template-rows: 3fr 4fr;
    grid-template-rows: min-content min-content;
  }
  .id {
    visibility: hidden;
    position: absolute;
    left: 0;
    top: -0.5rem;
    font-size: .5rem;
  }
  .name {
    position: relative;
    padding-bottom: 0.5rem;
  }
  .nutrition {
    grid-area: nutrition;
    display: flex;
    justify-content: space-between;
    margin-right: 3rem;
    font-style: italic;
  }
  .nutrition > div {
    margin-right: 1rem;
    font-size: 0.9rem;
  }
  .batches, .edit {
    justify-self: end;
  }
  .batches {
    grid-area: batches;
    color:  hsl(217, 71%, 53%);
    font-weight: bold;
  }
  .details {
    grid-area: details;
    align-self: center;
    justify-self: right;
  }
  .edit {
    grid-area: edit;
    align-self: center;
  }
</style>
