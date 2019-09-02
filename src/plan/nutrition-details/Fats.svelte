<script>
  import { getNutritionDetailsSubset } from '../../scripts/utils.js';
  import Template from './Template.svelte';

  export let nutritionData;

  const subset = [
    { 'Total lipid (fat)': [] },
    { 'Fatty acids, total saturated': [
        '4:00',
        '6:00',
        '8:00',
        '10:00',
        '12:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '22:00',
        '24:00:00',
      ]
    },
    { 'Fatty acids, total monounsaturated': [
        '14:01',
        '15:01',
        '16:1 undifferentiated',
        '16:1 c',
        '16:1 t',
        '17:01',
        '18:1 undifferentiated',
        '18:1 c',
        '18:1 t',
        '20:01',
        '22:1 undifferentiated',
        '22:1 c',
        '22:1 t',
        '24:1 c',
      ]
    },
    { 'Fatty acids, total polyunsaturated': [
        '16:2 undifferentiated',
        '18:2 undifferentiated',
        '18:2 n-6 c,c',
        '18:2 CLAs',
        '18:2 t,t',
        '18:2 i',
        '18:2 t not further defined',
        '18:03',
        '18:3 n-3 c,c,c (ALA)',
        '18:3 n-6 c,c,c',
        '18:3i',
        '18:4 undifferentiated',
        '20:2 n-6 c,c',
        '20:3 undifferentiated',
        '20:3 n-3',
        '20:3 n-6',
        '20:4 undifferentiated',
        '20:4 n-6',
        '20:5 n-3 (EPA)',
        '22:02',
        '22:5 n-3 (DPA)',
        '22:6 n-3 (DHA)'
      ]
    },
    { 'Fatty acids, total trans': [] },
    { 'Fatty acids, total trans-monoenoic': [] },
    { 'Fatty acids, total trans-polyenoic': [] },
    // todo: check for missing keys from usdaMap
  ];

  const totalOmega = (type) => ({
    nutrient: `Fatty acids, total omega-${type}`,
    unit: 'g',
    value: subset
      .flatMap(x => Object.values(x))
      .flat()
      .filter(x => x.includes(`n-${type}`))
      .map(x => nutritionData[x])
      .reduce((a, v) => a + (v === undefined ? 0 : v.value), 0),
    sublist: []
  });

  const nutritionDetails = [
    ...getNutritionDetailsSubset(nutritionData, subset),
    totalOmega(3),
    totalOmega(6),
  ];
</script>


<Template
  expandable={true}
  title='Fats & Fatty Acids'
  {nutritionDetails} />