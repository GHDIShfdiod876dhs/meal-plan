<script>
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import { db } from '../scripts/firebase.js';
  import { user } from '../scripts/user.js';
  import Column from './Column.svelte';

  export let current;
  export let buttons;

  let loading = true;

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),
    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;
      return {
        duration: 600,
        easing: quintOut,
        css: t => `
					transform: ${transform};
					opacity: ${t}
				`
        // css: t => `
				// 	transform: ${transform} scale(${t});
				// 	opacity: ${t}
				// `
      };
    }
  });

  let foods = [];
  const updateFoods = newFoods => foods = newFoods;
  const shoppingListRef =
    db.collection('shopping lists')
      .doc($user.uid)
      .collection('items');

  shoppingListRef
  .onSnapshot(snapshot => {
    loading = false;
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        if (!foods.find(x => x.id === change.doc.id)) {
          foods = [...foods, { id: change.doc.id, ...change.doc.data() }]; 
          // console.log('New food:', change.doc.data());
        }
      }
      if (change.type === 'modified') {
        const updateIdx = foods.findIndex(x => x.id === change.doc.id);
        foods[updateIdx] = { id: change.doc.id, ...change.doc.data() };
        foods = [...foods];
        // console.log('Modified food:', change.doc.data());
      }
      if (change.type === 'removed') {
        foods = foods.filter(x => x.id !== change.doc.id)
        // console.log('Removed food:', change.doc.data());
      }
    })
  });

  function flash({ style }) {
    const origBorder = style.border;
    style.transition = 'border 300ms linear, box-shadow 300ms linear';
    style.border = '1px solid var(--blue-color)';
    style.boxShadow = '0 1px 6px hsla(217, 71%, 53%, .5)';
    setTimeout(() => {
      style.border = origBorder;
      style.boxShadow = 'var(--shadow)';
    }, 300);
  }

  function update({ id }) {
    [...document.querySelectorAll('.pane')]
      .filter(node => node.parentElement.classList.contains(id))
      .forEach(flash);
  }
</script>


<div class='board'>
  {#each buttons.slice(1) as column}
    {#if current === column || current === 'All'}
      <Column
        {shoppingListRef}
        {loading}
        {column}
        {current}
        {foods}
        {updateFoods}
        {update}
        {send}
        {receive} />
    {/if}
  {/each}
</div>


<style>
  .board {
    display: flex;
  }
</style>