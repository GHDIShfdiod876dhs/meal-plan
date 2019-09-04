<script>
  import Spinner from '../../../components/Spinner.svelte';

  export let name;
  export let inUse;
  export let handleSubmit;
  export let modalClose;

  let loading = false;

  function confirm() {
    loading = true;
    handleSubmit().then(
      () => {
        loading = false;
        modalClose();
      }
    )
  }
</script>


<div class='container'>
  {#if inUse}
    <h3>Sorry, you can't delete "{name}" while there are meals planned for them.</h3>
    <button class='button' on:click={modalClose}>Ok</button>
  {:else}
    <h3>Are you sure you want to delete "{name}?"</h3>
    <p>This action cannot be undone.</p>
    <div class='buttons'>
      <button class='button' on:click={confirm}>
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
