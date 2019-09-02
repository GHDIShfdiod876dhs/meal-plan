<script>
  import { getNutritionDetailsSubset } from '../../scripts/utils.js';
  import Template from './Template.svelte';

  export let nutritionData;

  const subset = [
    { 'Protein': [
        'Tryptophan',
        'Threonine',
        'Isoleucine',
        'Leucine',
        'Lysine',
        'Methionine',
        'Cystine',
        'Phenylalanine',
        'Tyrosine',
        'Valine',
        'Arginine',
        'Histidine',
        'Alanine',
        'Aspartic acid',
        'Glutamic acid',
        'Glycine',
        'Proline',
        'Serine',
        'Hydroxyproline',
      ]
    },
  ];

  const nutritionDetails = getNutritionDetailsSubset(nutritionData, subset);
</script>


<Template
  expandable={true}
  title='Protein & Amino Acids'
  {nutritionDetails} />