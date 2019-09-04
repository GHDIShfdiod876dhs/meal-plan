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
  <h3>Are you sure you want to clear all calendars?</h3>
  <p>This action cannot be undone.</p>
  <div class='buttons'>
    <button class='button' on:click={confirm}>
      {#if loading}<Spinner />{:else}Yes{/if}
    </button>
    <button class='button' on:click={modalClose}>Cancel</button>
  </div>
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

<!-- <form on:submit|preventDefault={close}>
  <h3>Are you sure you want to delete "{name}?"</h3>
  <p>This action cannot be undone.</p>
  <div class='field has-addons'>
    <div class='control'>
      <input bind:value={name} class='input' type='text'>
    </div>
    <div class='control'>
      <button class='button' type='submit'>
        {#if loading}<Spinner />{:else}Save{/if}
      </button>
    </div>
  </div>
  <p class='validation' class:invalid={invalid}>This name is already in use!</p>
</form>


<style>
  form {
    padding: 0.5rem;
  }
  h3 {
    margin-bottom: 1rem;
  }
  button {
    width: 3.75rem;
  }
  .validation {
    font-size: 0.9rem;
    font-style: italic;
    color: red;
    margin-top: -0.5rem;
    opacity: 0;
  }
  .invalid {
    opacity: 1;
  }
</style>
 -->
