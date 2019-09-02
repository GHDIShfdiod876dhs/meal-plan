<script>
  import { fade, scale } from 'svelte/transition';
  import Pane from './Pane.svelte';

  export let modalClose;
</script>


<div
  class='backdrop'
  transition:fade={{ duration: 300 }}
  on:click={modalClose}>
  <div
    class='pane-wrapper'
    on:click|stopPropagation
    transition:scale={{ duration: 300 }}>
    <Pane theme='LIGHT'>
      <slot></slot>
    </Pane>
  </div>
</div>


<style>
  .backdrop {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: var(--modal-bg);
    z-index: 1000;
  }
  .pane-wrapper {
    max-height: 95%;
    max-width: 80%;
    overflow: scroll;
  }
</style>
