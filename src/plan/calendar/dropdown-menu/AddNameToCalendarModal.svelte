<script>
  export let name;
  export let handleSubmit;
  export let modalClose;

  function close() {
    handleSubmit(name);
    modalClose();
  }
</script>

<form on:submit|preventDefault={close}>
  <h3>Add a name:</h3>
  <div class='field has-addons'>
      <div class='control'>
        <input bind:value={name} class='input' type='text' placeholder='Name'>
      </div>
      <div class='control'>
        <button class='button' type='submit'>Save</button>
      </div>
    </div>
</form>


<style>
  form {
    padding: 0.5rem;
  }
  h3 {
    margin-bottom: 1rem;
  }
</style>

