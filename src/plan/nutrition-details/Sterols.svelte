<script>
  import { getNutritionDetailsSubset } from '../../scripts/utils.js';
  import Template from './Template.svelte';

  export let nutritionData;

  const subset = [
    { 'Cholesterol': [] },
    { 'Phytosterols': [
        'Campesterol',
        'Stigmasterol',
        'Beta-sitosterol',
      ]
    },
  ];
  
  const nutritionDetails = getNutritionDetailsSubset(nutritionData, subset);
</script>


<Template
  expandable={true}
  title='Sterols'
  {nutritionDetails} />