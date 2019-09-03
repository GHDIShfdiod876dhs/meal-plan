<script>
  import { fade, slide } from 'svelte/transition';
  import Pane from '../../../components/Pane.svelte';

  export let addName;
  export let changeName;

  let menuVisible = false;
  const toggleMenu = () => menuVisible = !menuVisible;
</script>


<div class='wrapper'>
  <div class='toggle' on:click={toggleMenu}>
    <div class='ellipsis'>
      <div class='dot'></div>
      <div class='dot'></div>
      <div class='dot'></div>
    </div>
  </div>

  {#if menuVisible}
    <div
      class='close-menu'
      on:click={toggleMenu}
      transition:fade={{ duration: 300 }}>
    </div>
    <div class='drop-down' transition:slide>
      <Pane theme={'LIGHT'}>
        <div class='menu' on:click|stopPropagation={toggleMenu}>
          <span>todo: clear calendar</span>
          <span on:click={changeName}>Change name</span>
          <span>todo: delete name</span>
          <span on:click={addName}>Add name</span>
        </div>
      </Pane>
    </div>
  {/if}
</div>


<style>
  .wrapper {
    --toggle-top: calc(45vh + 0.5rem);
    --toggle-right: calc((100vw - var(--max-width)) / 2);
    --toggle-padding: 0.25rem;
    --ellipsis-height: 1rem;
    z-index: 100;
  }
  .toggle {
    background: var(--light-bg);
    border: var(--light-border);
    border-radius: 50%;
    box-shadow: var(--shadow);
    margin: 0;
    padding: var(--toggle-padding);
    position: absolute;
    right: var(--toggle-right);
    top: var(--toggle-top);
  }
  .ellipsis {
    height: var(--ellipsis-height);
    width: var(--ellipsis-height);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .dot {
    background: #333;
    border-radius: 50%;
    width: calc(var(--ellipsis-height) / 4);
    height: calc(var(--ellipsis-height) / 4);
    opacity: 0.5;
  }
  .drop-down {
    display: block;
    position: fixed;
    top: calc(var(--toggle-top) + 2 * var(--toggle-padding) + var(--ellipsis-height) + 3px); 
    right: var(--toggle-right);
  }
  .menu {
    display: flex;
    flex-direction: column;
  }
  .close-menu {
    position: fixed;
    top: var(--navbar-height);
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--modal-bg);
    opacity: 0.8;
  }
  span {
    color: #333;
    text-decoration: none;
    padding: 0 1.5rem;
    line-height: 3rem;
  }
  span:hover {
    background: var(--dark-bg);
  }
</style>
