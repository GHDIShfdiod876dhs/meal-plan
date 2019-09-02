<script>
  import Tabs from '../components/Tabs.svelte';
  import Wrapper from '../components/Wrapper.svelte';
  import Ingredients from './Ingredients.svelte';
  import Recipes from './Recipes.svelte';

  const tabs = [
    { header: 'ingredients', component: Ingredients },
    { header: 'recipes', component: Recipes }
  ];
</script>

<Wrapper>
  <Tabs {tabs} />
</Wrapper>