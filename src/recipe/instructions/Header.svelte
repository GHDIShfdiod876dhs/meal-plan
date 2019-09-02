<script>
  import { capitalize } from '../../scripts/utils.js';
  import Spinner from '../../components/Spinner.svelte';
  
  export let addInstruction;

  let input;
  let loading = false;

  function handleSubmit() {
    loading = true;
    addInstruction(capitalize(input.value.trim()), () => loading = false);
    input.value = '';
  }
</script>


<div class='wrapper'>
  <h3>Cook/Combine:</h3>
  <form on:submit|preventDefault={handleSubmit}>
    <div class='field has-addons'>
      <div class='control'>
        <input bind:this={input} class='input' type='text' placeholder='New Instruction'>
      </div>
      <div class='control'>
        <button class='button' type='submit'>
          {#if loading}
            <Spinner />
          {:else}
            Save
          {/if}
        </button>
      </div>
    </div>
  </form>
</div>


<style>
  .wrapper:nth-last-of-type(1) {
    margin-top: 3rem;
  }
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 2rem;
  }
  .button {
    width: 3.75rem;
  }
</style>