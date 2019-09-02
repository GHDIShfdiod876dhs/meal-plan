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
  <div class='field has-addons'>
      <div class='control'>
        <input bind:value={name} class='input' type='text' placeholder='Name'>
      </div>
      <div class='control'>
        <button class='button' type='submit'>Save</button>
      </div>
    </div>
</form>

