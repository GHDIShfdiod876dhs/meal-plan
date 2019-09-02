<script>
  import { scale } from 'svelte/transition';

  export let modalClose;
  export let food;
  export let foods;
  export let close;

  let { have } = food;
  $: need =
    Math.max(0, Number((food.total - (isNaN(have) ? 0 : have)).toFixed(2)));
  
  function handleSubmit() {
    food.need = +need;
    food.have = +have;
    close(food);
    modalClose();
  }

  function handleInput(e) {
    if (e.key === 'Enter'
      || e.key === 'Backspace'
      || (e.target.value + e.key).match(/^\d*\.?\d{0,2}$/)) {
      return;
    }
    e.preventDefault()
  }
</script>


<form
  on:submit|preventDefault={handleSubmit}
  on:click|stopPropagation
  transition:scale={{ duration: 300, opacity: 0 }}>
  <h2 class='options-name'>{food.name}</h2>
    <strong>Need</strong>
    <span class='need'>{need}</span>
    <span class='unit'>{food.unit}</span>

    <strong>Have</strong>
    <input
      class='input'
      type='text'
      bind:value={have}
      on:keydown={handleInput} />
    <span class='unit'>{food.unit}</span>
  <button type='submit' />
</form>


<style>
  form {
    width: 50vw;
    min-width: 15rem;
    height: 50vh;
    display: grid;
    grid-template: 2fr repeat(3, 1fr) / 1fr 5rem 4rem 5rem 1fr;
    place-items: center center;
  }
  h2 {
    grid-column: 1 / -1;
  }
  input[type='text'] {
    text-align: center;
  }
  strong {
    grid-column: 2;
  }
  button {
    visibility: hidden;
  }
</style>
