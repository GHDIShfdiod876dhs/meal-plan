<script>
  import { slide, fade } from 'svelte/transition';
  import { link } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
  import Pane from '../components/Pane.svelte';
  import Hamburger from './Hamburger.svelte';

  export let logout;

  let menuVisible = false;
  const toggleMenu = () => menuVisible = !menuVisible;
</script>

<div class='big-screen'>
  <a href='/create_recipe' use:link use:active>New Recipe</a>
  <a href='/' use:link use:active={'/'}>Plan</a>
  <a href='/shop' use:link use:active>Shop</a>
  <a href='/prep' use:link use:active>Prep</a>
</div>

<div class='small-screen toggle' on:click={toggleMenu}><Hamburger /></div>

{#if menuVisible}
  <div
    class='close-menu'
    on:click={toggleMenu}
    transition:fade={{ duration: 300 }}>
  </div>
  <div class='small-screen drop-down' transition:slide>
    <Pane theme={'LIGHT'}>
      <div class='menu' on:click|stopPropagation={toggleMenu}>
        <a href='/create_recipe' use:link use:active>New Recipe</a>
        <a href='/' use:link use:active={'/'}>Plan</a>
        <a href='/shop' use:link use:active>Shop</a>
        <!-- <a href='/prep' use:link use:active>Prep</a> -->
        <span on:click={logout}>Logout</span>
      </div>
    </Pane>
  </div>
{/if}

<style>
  a, span {
    color: #333;
    text-decoration: none;
    padding: 0 1.5rem;
    line-height: 3rem;
  }
  :global(a.active) {
    color: var(--blue-color);
  }
  .small-screen {
    display: none;
  }
  @media only screen and (max-width: 700px) {
    .big-screen {
      display: none;
    }
    .small-screen {
      display: block;
    }
    .toggle {
      justify-self: flex-end;
      padding: 0 0.5rem;
    }
    .drop-down {
      position: absolute;
      top: calc(var(--navbar-height) + 1px);
      right: 1px;
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
    a:hover,
    span:hover {
      background: var(--dark-bg);
    }
  }
</style>