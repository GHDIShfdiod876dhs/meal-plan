<script>
  import { getContext } from 'svelte';
  import { db } from '../scripts/firebase.js';
  import { user } from '../scripts/user.js';
  import DeleteRecipeModal from './DeleteRecipeModal.svelte';
  import Wrapper from '../components/Wrapper.svelte';
  import Name from './Name.svelte';
  import Servings from './Servings.svelte';
  import Ingredients from './ingredients/Ingredients.svelte';
  import Instructions from './instructions/Instructions.svelte';

  export let params = {};

  function handleClick() {
    let inUse;
    db.collection('plans')
      .doc($user.uid)
      .collection('currentWeekAggregate')
      .doc(params.id).get()
      .then(doc => {
        if (doc.exists && doc.data().servings > 0) {
          inUse = true;
        }
      })
      .then(
        () => getContext('MODAL').setModalContent({
          component: DeleteRecipeModal,
          props: { inUse, recipeId: params.id }
        }),
        error => console.error('Error getting recipe in currentWeekAggregate:', error)
      )
  }
</script>


<Wrapper scrollable={true}>
  <button id='delete' class='button' on:click={handleClick}>🗑</button>
  <Name {params} />
  <Servings {params} />
  <Ingredients {params} />
  <Instructions {params} />
</Wrapper>


<style>
  #delete {
    position: absolute;
    right: calc((100vw - var(--max-width)) / 2);
    top: calc(var(--navbar-height) + 1rem);
  }
</style>