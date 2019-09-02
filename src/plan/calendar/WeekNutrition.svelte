<script>
  import { getContext } from 'svelte';
  import { formatNum } from '../../scripts/utils.js';
  import Pane from '../../components/Pane.svelte';
  import NutritionDetails from '../nutrition-details/NutritionDetails.svelte';

  export let meals;
  let kcal, carbs, fats, protein, fiber;
  
  meals.subscribe(s => {
    function sumData(store, attr) {
      if (typeof store === 'object') {
        return formatNum(
          store
          .flat()
          .reduce((a, v) =>
            a + (v.nutritionData[attr] * v.servings / v.servingsPerRecipe), 0
          ) / 7,
          1
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
 
  function openWeekDetails() {
    // console.log($meals.flat());
    modalCtx.setModalContent({
      component: NutritionDetails,
      props: {
        recipes: $meals.flat(),
        header: 'This week\'s averages',
        isWeek: true
      },
      // props: { recipes: [...$meals.flat()] },
    });
  }
</script>


<div class="week-nutrition">
  <Pane>
    <div class="week-nutrition-inner">
      <span>{kcal}</span>
      <span>{carbs}</span>
      <span>{fats}</span>
      <span>{protein}</span>
      <span>{fiber}</span>
      <span>
        {#if $meals.length}
          <span on:click={openWeekDetails}>🔍</span>
        {/if}
      </span>
    </div>
  </Pane>
</div>


<style>
  .week-nutrition {
    position: fixed;
    bottom: 0;
    left: calc((100vw - var(--max-width)) / 2);
    width: var(--max-width);
  }
  .week-nutrition-inner {
    line-height: 1.5;
    font-size: 0.75rem;
    display: flex;
    justify-content: space-between;
  }
</style>
