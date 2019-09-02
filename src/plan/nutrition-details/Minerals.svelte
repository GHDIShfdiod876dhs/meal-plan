<script>
  import { getNutritionDetailsSubset } from '../../scripts/utils.js';
  import Template from './Template.svelte';

  export let nutritionData;

  const subset = [
    { 'Calcium, Ca': [] },
    { 'Iron, Fe': [] },
    { 'Magnesium, Mg': [] },
    { 'Phosphorus, P': [] },
    { 'Potassium, K': [] },
    { 'Sodium, Na': [] },
    { 'Zinc, Zn': [] },
    { 'Copper, Cu': [] },
    { 'Manganese, Mn': [] },
    { 'Selenium, Se': [] },
    { 'Fluoride, F': [] }
  ];
  const nutritionDetails = getNutritionDetailsSubset(nutritionData, subset);
 
</script>


<Template
  title='Minerals'
  {nutritionDetails} />