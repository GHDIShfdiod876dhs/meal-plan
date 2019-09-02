<script>
  import { oMap } from '../../scripts/utils.js';
  import { usdaMap } from '../../scripts/usdaMap.js';
  import CalorieInfo from './CalorieInfo.svelte';
  import Protein from './Protein.svelte';
  import Carbohydrates from './Carbohydrates.svelte';
  import Fats from './Fats.svelte';
  import Vitamins from './Vitamins.svelte';
  import Minerals from './Minerals.svelte';
  import Sterols from './Sterols.svelte';
  import Misc from './Misc.svelte';

  export let recipes;
  export let header;
  export let isMenuItem = false;
  export let isWeek = false;

  const displayNutritionData = (acc, [attr_id, value]) => {
    const usda = usdaMap[attr_id];
    return {
      ...acc,
      [usda.name]: { value, unit: usda.unit }
    };
    // return usda
    //   ? {
    //     ...acc,
    //     [usda.name]: { value, unit: usda.unit }
    //     }
    //   : acc;
  }

  const sumNutritionData = (prevSum, nextData) =>
  // nextData.map(([k, v]) => [k, prevSum[k] ? v + prevSum[k] : v]);
    Object.fromEntries(
      Object.keys(usdaMap).map(k => [k, (prevSum[k] || 0) + (nextData[k] || 0)])
    );
  
  const scaleNutritionData = recipe => isMenuItem
    ? oMap(recipe.nutritionData, ([k, v]) => [k, v / recipe.servingsPerRecipe])
    : oMap(
        recipe.nutritionData,
        ([k, v]) => [k, v * recipe.servings / recipe.servingsPerRecipe]
      );

  const divideBy7 = ([attr_id, val]) => [attr_id, val / 7];

  let rawData =
    recipes
      .map(scaleNutritionData)
      .map(Object.fromEntries)
      .reduce(sumNutritionData, []);

  if (isWeek) {
    rawData = Object.fromEntries(
      Object.entries(rawData).map(divideBy7)
    );
  }

  const nutritionData = Object.entries(rawData).reduce(displayNutritionData, {});
  // const nutritionData =
  //   recipes
  //     .map(scaleNutritionData)
  //     .map(Object.fromEntries)
  //     .reduce(sumNutritionData, [])
  //     .reduce(displayNutritionData, {});

</script>


<!-- {#if isMenuItem}
  <h3>{recipes[0].name}</h3>
{/if} -->
<h3>{header}</h3>
<div class="details-pane">
  <CalorieInfo {nutritionData} />
  <Protein {nutritionData} />
  <Carbohydrates {nutritionData} />
  <Fats {nutritionData} />
  <Vitamins {nutritionData} />
  <Minerals {nutritionData} />
  <Sterols {nutritionData} />
  <Misc {nutritionData} />
</div>
