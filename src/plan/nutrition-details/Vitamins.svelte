<script>
  import { getNutritionDetailsSubset } from '../../scripts/utils.js';
  import Template from './Template.svelte';

  export let nutritionData;

  const subset = [
    { 'Vitamin A, IU': [
        'Retinol',
        'Carotene, alpha',
        'Carotene, beta',
        'Cryptoxanthin, beta',
        'Lycopene',
        'Lutein + zeaxanthin'
      ]
    },
    { 'Vitamin C, total ascorbic acid': [] },
    { 'Vitamin D': [
        'Vitamin D (D2 + D3)',
        'Vitamin D2 (ergocalciferol)',
        'Vitamin D3 (cholecalciferol)',
      ]
    },
    { 'Vitamin E (alpha-tocopherol)': [
        'Tocopherol, beta',
        'Tocopherol, gamma',
        'Tocopherol, delta'
      ]
    },
    { 'Vitamin K (phylloquinone)': [] },
    { 'Thiamin': [] },
    { 'Riboflavin': [] },
    { 'Niacin': [] },
    { 'Vitamin B-6': [] },
    { 'Folate, total': [
        'Folate, food',
        'Folic acid',
        'Folate, DFE'
      ]
    },
    { 'Vitamin B-12': [] },
    { 'Pantothenic acid': [] },
    { 'Choline, total': [] },
    { 'Betaine': [] }
  ];

  const nutritionDetails = getNutritionDetailsSubset(nutritionData, subset);
</script>


<Template
  expandable={true}
  title='Vitamins'
  {nutritionDetails} />