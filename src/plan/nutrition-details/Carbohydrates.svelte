<script>
  import { getNutritionDetailsSubset } from '../../scripts/utils.js';
  import Template from './Template.svelte';

  export let nutritionData;

  const subset = [
    { 'Carbohydrate, by difference': [] },
    { "Fiber, total dietary": [] },
    { 'Starch': [] },
    { 'Sugars, total': [
        'Sucrose',
        'Glucose (dextrose)',
        'Fructose',
        'Lactose',
        'Maltose',
        'Galactose',
      ]
    },
  ];

  const nutritionDetails = getNutritionDetailsSubset(nutritionData, subset);
</script>


<Template
  expandable={true}
  title='Carbohydrates'
  {nutritionDetails} />