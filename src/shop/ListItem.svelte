<script>
  export let column;
  export let food;
  export let move;
  export let openDivider;

  const handleChange = () => move(food);
  const handleClick = () => openDivider(food);
</script>

<div>
  <input
    type='checkbox'
    checked={column === 'have'}
    on:change={handleChange} />
  <p class='name'>{food.name}</p>
  <button on:click={handleClick}>➗</button>
  <p class='amount'>
    <span>{food[column]}</span>
    <span>{food.unit}</span>
  </p>
</div>


<style>
  input[type='checkbox'] {
    visibility: hidden;
    position: absolute;
    left: 0.5em;
    top: 0.6em;
    margin: 0;
  }
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  button {
    position: absolute;
    top: 0.2em;
    right: 0.2em;
    height: calc(100% - 0.4em);
    background: transparent;
    border: none;
    opacity: 0.3;
    transition: opacity 0.3s;
    cursor: pointer;
  }
  div:hover button {
    opacity: 0.75;
  }
  @media (hover: hover) {
    button {
      opacity: 0;
    }
  }
  .amount {
    font-size: 0.8rem;
    font-style: italic;
  }
</style>