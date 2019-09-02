<script>
  import { getNutritionDetailsSubset } from '../../scripts/utils.js';
  import Template from './Template.svelte';

  export let nutritionData;

  const subset = [
    { 'Alcohol, ethyl': [] },
    { 'Water': [] },
    { 'Ash': [] },
    { 'Caffeine': [] },
    { 'Theobromine': [] },
  ];
  const nutritionDetails = getNutritionDetailsSubset(nutritionData, subset);
</script>


<Template
  title='Misc'
  {nutritionDetails} />