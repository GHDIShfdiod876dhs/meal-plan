<script>
  import { tick } from 'svelte';
  import { getRecipeRef } from '../scripts/utils.js';
  import { db, auth } from '../scripts/firebase';
  import Spinner from '../components/Spinner.svelte';
 
  export let params = {};

  let edit = false;
  let invalid = false;
  let input;
  let servingsPerRecipe = 1;
  getRecipeRef(params).onSnapshot(doc => {
    const servings = doc.data().servingsPerRecipe;
    servingsPerRecipe = servings === undefined ? 1 : servings;
  })

  function handleSubmit(e) {
    if (input.value) {
      getRecipeRef(params)
      .update({ servingsPerRecipe: input.value })
      .then(() => edit = false);
    }
    else {
      invalid = true;
      input.focus();
    }
  }

  async function startEditServings() {
    edit = true;
    await tick();
    input.value = servingsPerRecipe;
    input.focus();
  }
</script>


<div class='servings-per-recipe'>
  {#if edit}
    <form on:submit|preventDefault={handleSubmit}>
      <div class='field has-addons'>
        <div class='control'>
          <input bind:this={input} class='input' type='number' placeholder='servings per recipes'>
        </div>
        <div class='control'>
          <button class='button' type='submit'>
            Save
          </button>
        </div>
      </div>
      {#if invalid}
        <div class='invalid'>Your recipe needs a name!</div>
      {/if}
    </form>    
  {:else}
    <em on:click={startEditServings}>makes {servingsPerRecipe} serving{servingsPerRecipe === 1 ? '' : 's'}</em> 
  {/if}
</div>


<style>
  .servings-per-recipe {
    display: flex;
    justify-content: center;   
  }
  em {
    text-align: center;
  }
  .invalid {
    color: red;
    text-align: center;
  }
</style>