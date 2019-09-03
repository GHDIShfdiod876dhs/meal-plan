<script>
  import Spinner from '../../../components/Spinner.svelte';

  export let name;
  export let handleSubmit;
  export let modalClose;

  let invalid;
  let loading = false;

  async function close() {
    loading = true;
    invalid = await handleSubmit(name);
    loading = false;
    if (!invalid) {
      modalClose();
    }
  }
</script>

<form on:submit|preventDefault={close}>
  <h3>Change this name:</h3>
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

