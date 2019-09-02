<script>
  import { getContext } from 'svelte';
  import { formatNum } from '../../scripts/utils.js';
  import Pane from '../../components/Pane.svelte';
  import NutritionDetails from '../nutrition-details/NutritionDetails.svelte';

  export let meals;
  export let dayIdx;

  const days =
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let kcal, carbs, fats, protein, fiber;
  
  meals.subscribe(s => {
    function sumData(store, attr) {
      if (typeof store === 'object') {
        return formatNum(
          store.reduce((a, v) => a + (v.nutritionData[attr] / v.servingsPerRecipe * v.servings), 0),
          0
        );
      }
    }
    kcal = sumData(s, 208);
    carbs = sumData(s, 205);
    fats = sumData(s, 204);
    protein = sumData(s, 203);
    fiber = sumData(s, 291);
  });

  const modalCtx = getContext('MODAL');
 
  function openDayDetails() {
    modalCtx.setModalContent({
      component: NutritionDetails,
      props: { recipes: $meals, header: days[dayIdx] },
    });
  }
</script>


<Pane>
  <div class='kcal'>{kcal}
    {#if $meals.length}
      <span on:click={openDayDetails}>🔍</span>
    {/if}
  </div>
  <div class='macros'>
    <span>{carbs}</span>
    <span>{fats}</span>
    <span>{protein}</span>
    <span>{fiber}</span>
  </div>
</Pane>


<style>
  .kcal,
  .macros {
    font-size: 0.75rem;
    display: flex;
    justify-content: space-between;
  }
  .kcal {
    padding-bottom: 0.5rem;
  }
</style>
