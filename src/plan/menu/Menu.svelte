<script>
  import { afterUpdate } from 'svelte';
  import { initializeScrollBehavior } from '../../scripts/scroll.js';
  import { db, auth } from '../../scripts/firebase.js';
  import { matches, menu, query } from './menu.js';
  import Pane from '../../components/Pane.svelte';
  import Spinner from '../../components/Spinner.svelte';
  import MenuItem from './MenuItem.svelte';

  const { uid } = auth.currentUser;
  let recipes = [];
  let loading = true;
  let list;
  
  db
  .collection('recipes')
  .where('uid', '==', uid)
  .orderBy('name')
  .onSnapshot(snapshot => {
    loading = false;
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        if (!$menu.find(item => item.id === change.doc.id)) {
          menu.add({ id: change.doc.id, ...change.doc.data() });
          // console.log('New menu item:', change.doc.data());
        }
      }
      if (change.type === 'modified') {
        menu.updateRecipe(change.doc.id, change.doc.data());
        // console.log('Modified menu item:', change.doc.data());
      }
      if (change.type === 'removed') {
        menu.delete(change.doc.id);
        // console.log('Removed menu item:', change.doc.data());
      }
    })
  });

  let handleScroll;

  afterUpdate(() =>
    handleScroll = initializeScrollBehavior(list, 'var(--dark-border)'));
</script>

<div class='menu'>
  <header>
    <h3>Menu</h3>
    <div class='control'>
      <input
        type='text'
        class='input'
        placeholder='Search recipes'
        bind:value={$query}>
    </div>
  </header>
  
  <ul
    id='menu'
    on:scroll={e => handleScroll(e)}
    bind:this={list}>
    {#each $matches as recipe}
      <li
        draggable='true'
        on:dragstart={(e) => e.dataTransfer.setData('id', recipe.id)}>
        <Pane>
          <MenuItem {recipe} />     
        </Pane>
      </li>
    {/each}

    {#if !$matches.length}
      <li id='no-matches'>
        {#if loading}<Spinner />{:else}No matches{/if}
      </li>
    {/if}
  </ul> 
</div>


<style>
  .menu {
    width: 36rem;
    justify-self: center;
    height: 100%;
  }
  header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
  header h3 {
    margin: 0;
  }
  #menu {
    list-style-type: none;
    margin-left: 0;
    overflow-y: scroll;
    height: calc(45vh - var(--navbar-height) - 3rem - 1rem);
    border-radius: 2px;
  }
  #no-matches {
    text-align: center;
    font-size: 3rem;
    font-style: italic;
    opacity: 0.5;
    border: none;
    background: transparent;
  }

  @media only screen and (max-width: 700px) {
    .menu {
      width: 95vw;
    }
  }
</style>
