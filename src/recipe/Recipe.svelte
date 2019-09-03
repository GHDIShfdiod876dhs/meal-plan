<script>
  import Wrapper from '../components/Wrapper.svelte';
  import Name from './Name.svelte';
  import Servings from './Servings.svelte';
  import Ingredients from './ingredients/Ingredients.svelte';
  import Instructions from './instructions/Instructions.svelte';

  export let params = {};
</script>


<Wrapper scrollable={true}>
  <Name {params} />
  <Servings {params} />
  <Ingredients {params} />
  <Instructions {params} />
</Wrapper>
