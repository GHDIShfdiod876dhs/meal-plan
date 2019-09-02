<script>
  import { getNutritionDetailsSubset } from '../../scripts/utils.js';
  import {} from '../../scripts/usdaMap.js';
  import Template from './Template.svelte';

  export let nutritionData;

  const getCalories = (label, nutrient, factor) => ({
    nutrient: label,
    unit: 'kcal',
    value: nutritionData[nutrient] ? nutritionData[nutrient].value * factor : 0
  });

  const nutritionDetails = [
    ...getNutritionDetailsSubset(nutritionData, [{ 'Energy': [] }]),
    getCalories('From carbohydrates', 'Carbohydrate, by difference', 4),
    getCalories('From fats', 'Total lipid (fat)', 9),
    getCalories('From protein', 'Protein', 4),
    getCalories('From alchohol', 'Alcohol, ethyl', 7),
  ];
</script>


<Template
  title='Calorie Information'
  {nutritionDetails} />