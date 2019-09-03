<script>
  import { push } from 'svelte-spa-router';
  import Spinner from '../components/Spinner.svelte';

  export let inUse;
  export let name;
  export let recipeRef;
  export let modalClose;

  let loading = false;

  function deleteRecipe() {
    loading = true;
    recipeRef.delete().then(
      () => {
        loading = false;
        console.log('Recipe successfully deleted!');
        modalClose();
        push('/');
      },
      error => console.error('Error deleting recipe:', error)
    );
  }
</script>

<div class='container'>
  {#if inUse}
    <h3>Sorry, you can't delete this recipe while it's on your calendar.</h3>
    <button class='button' on:click={modalClose}>Ok</button>
  {:else}
    <h3>Are you sure you want to delete "{name}?"</h3>
    <p>This action cannot be undone.</p>
    <div class='buttons'>
      <button class='button' on:click={deleteRecipe}>
        {#if loading}<Spinner />{:else}Yes{/if}
      </button>
      <button class='button' on:click={modalClose}>Cancel</button>
    </div>
  {/if}
</div>


<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 0.5rem;
  }
  h3, p {
    text-align: center;
  }
  h3 {
    margin-bottom: 1rem;
  }
  p {
    font-style: italic;
  }
  .buttons {
    display: flex;
    justify-content: center;
  }
  button {
    margin-top: 1.5rem;
  }
</style>