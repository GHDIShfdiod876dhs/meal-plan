<script>
  import { tick } from 'svelte';
  import { capitalize, getRecipeRef } from '../scripts/utils.js';
  import { db, auth } from '../scripts/firebase';
  import Spinner from '../components/Spinner.svelte';
 
  export let params = {};

  let edit = false;
  let invalid = false;
  let input;
  let name;
  getRecipeRef(params).onSnapshot(doc => name = doc.data().name);

  function handleSubmit(e) {
    if (input.value) {
      getRecipeRef(params)
      .update({ name: capitalize(input.value) })
      .then(() => edit = false);
    }
    else {
      invalid = true;
      input.focus();
    }
  }

  async function startEditName() {
    edit = true;
    await tick();
    input.value = name;
    input.focus();
  }
</script>


<div class='name'>
  {#if !name}
    <Spinner />
  {:else if edit}
    <form on:submit|preventDefault={handleSubmit}>
      <div class='field has-addons'>
        <div class='control'>
          <input bind:this={input} class='input' type='text' placeholder='Recipe name'>
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
    <h1 on:click={startEditName}>{name}</h1> 
  {/if}
</div>


<style>
  .name {
    margin-top: 1rem;
    display: flex;
    justify-content: center;   
  }
  h1 {
    text-align: center;
  }
  .invalid {
    color: red;
    text-align: center;
  }
</style>