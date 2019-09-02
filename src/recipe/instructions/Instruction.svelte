<script>
  import { tick } from 'svelte';

  export let item;
  export let editInstruction;
  export let removeInstruction;

  let editInput;
  let edit = false;
    
  async function startEdit() {
    edit = true;
    await tick();
    editInput.focus();
  }

  function endEdit() {
    editInstruction({ ...item, instruction: editInput.innerText.trim() });
    edit = false;
  }

  const handleEnter = evt => evt.key === 'Enter' && endEdit();

  const remove = () => removeInstruction(item);
</script>


<span class='outer-wrapper'>
  {#if edit}
    <div
      bind:this={editInput}
      contenteditable
      class='listItem'
      on:blur={endEdit}
      on:keypress={handleEnter} >
      {item.instruction}
    </div>
  {:else}
    <div class='listItem'>{item.instruction}</div>
  {/if}
  <span class='wrapper'>
    {#if edit}
      <span class='edit-button'>💾</span>
    {:else}
      <span class='edit-button'on:click={startEdit}>✏️</span>
    {/if}
    <span on:click={remove}>🗑️</span>
  </span>
</span>


<style>
  .outer-wrapper {
    display: grid;
    grid-template-columns: 9fr 1fr;
  }
  .listItem {
    margin: 0.5rem;
    padding: 0.5rem;
    display: inline-flex;
    align-items: center;
  }
  .wrapper {
    cursor: default;
    padding: 0;
    margin: 0;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    min-height: 100%;
    width: 5rem;
    min-width: 5rem;
    border-left: 1px solid hsl(240, 8%, 70%);
  }
  @media only screen and (max-width: 400px) {
    .wrapper {
      width: 3rem;
      min-width: 3rem;
      padding: 1rem;
    }
    .edit-button {
      margin-bottom: 1rem;
    }
  }
</style>