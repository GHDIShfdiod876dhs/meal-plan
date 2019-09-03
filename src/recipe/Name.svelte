<script>
  import { tick, getContext } from 'svelte';
  import { capitalize, getRecipeRef } from '../scripts/utils.js';
  import { db } from '../scripts/firebase';
  import { user } from '../scripts/user.js';
  import DeleteRecipeModal from './DeleteRecipeModal.svelte';
  import Spinner from '../components/Spinner.svelte';
 
  export let params = {};

  let edit = false;
  let loading = false;
  let invalid = false;
  let input;
  let name;
  const recipeRef = getRecipeRef(params);
  getRecipeRef(params).onSnapshot(doc => {
    if (doc.exists) {
      name = doc.data().name
    }
  });

  function handleSubmit(e) {
    if (input.value) {
      loading = true;
      getRecipeRef(params)
      .update({ name: capitalize(input.value) })
      .then(() => {
        loading= false;
        edit = false;
      });
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

  function deleteRecipe() {
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
          props: { inUse, name, recipeRef }
        }),
        error => console.error('Error getting recipe in currentWeekAggregate:', error)
      )
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
          <button id='submit' class='button' type='submit'>
            {#if loading}<Spinner />{:else}Save{/if}
          </button>
        </div>
      </div>
      {#if invalid}
        <div class='invalid'>Your recipe needs a name!</div>
      {/if}
    </form>    
  {:else}
    <h1 on:click={startEditName}>{name}</h1>
    <button id='delete' class='button' on:click={deleteRecipe}>🗑</button>
  {/if}
</div>


<style>
  .name {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr 0rem;
    justify-content: center;   
  }
  .name .field.has-addons {
    justify-content: center;
  }
  h1 {
    text-align: center;
  }
  #submit {
    width: 3.75rem;
  }
  .invalid {
    color: red;
    text-align: center;
  }
  #delete {
    justify-self: right;
  }
</style>