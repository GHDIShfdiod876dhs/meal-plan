<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { db } from '../../scripts/firebase.js';
  import { getRecipeRef } from '../../scripts/utils.js';
  import Sortable from 'sortablejs';
  import Pane from '../../components/Pane.svelte';
  import Header from './Header.svelte';
  import Instruction from './Instruction.svelte';

  export let params = {};

  const instructionsRef = getRecipeRef(params).collection('instructions');
  let instructions = [];
  let ol;

  instructionsRef
  .orderBy('number')
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        instructions = [
          ...instructions,
          { id: change.doc.id, ...change.doc.data() }
        ];
        // console.log('New instruction:', change.doc.data());
      }
      if (change.type === 'modified') {
        const newData = change.doc.data();
        const updateIdx = instructions.findIndex(i => i.id === change.doc.id);
        if (instructions[updateIdx].instruction !== newData.instruction) {
          instructions[updateIdx] = { id: change.doc.id, ...newData };
          instructions = [...instructions];
          // console.log('Modified instruction:', newData);
        }
      }
      if (change.type === 'removed') {
        instructions = instructions.filter(i => i.id !== change.doc.id)
        // console.log('Removed instruction:', change.doc.data());
      }
    })
  });

  function addInstruction(newInstruction, cb) {
    instructionsRef.add({
      created: Date.now(),
      number: instructions.length,
      instruction: newInstruction,
    })
    .then(
      cb,
      error => console.error('Error adding instruction:', error)
    );
  }

  function editInstruction(instruction) {
    instructionsRef.doc(instruction.id)
    .update(instruction)
    .then(
      () => console.log('Instruction successfully edited'),
      error => console.error('Error editing instruction:', error)
    );
  }

  function removeInstruction({ id }) {
    instructions = instructions.filter(i => i.id !== id);
    instructionsRef.doc(id)
    .delete()
    .then(
      () => console.log('Instruction successfully deleted'),
      error => console.error('Error deleting instruction:', error)
    );
  }

  onMount(() => {
    Sortable.create(ol, {
      animation: 150,
      onEnd: (evt) => {
        const [movedInstruction] = instructions.splice(evt.oldIndex, 1);
        instructions = [
          ...instructions.slice(0, evt.newIndex),
          movedInstruction,
          ...instructions.slice(evt.newIndex)
        ];

        const batch = db.batch();
        instructions.forEach((item, idx) => {
          const itemRef = instructionsRef.doc(item.id);
          batch.update(itemRef, { number: idx });
        });
        batch.commit();
      }
    });
  })
</script>


<Header {addInstruction} />

<ol bind:this={ol}>
  {#each instructions as item, idx (item)}
    <li
      draggable
      transition:fly|local={{ x: -300, duration: 300 }}
      animate:flip={{ duration: 300 }}>
      <Pane>
        <Instruction
          {item}
          {editInstruction}
          {removeInstruction} />
      </Pane>
    </li>
  {/each}
</ol>

<div class='invisible sortable-ghost'></div>


<style>
  ol {
    margin-left: 0;
    list-style-position: outside;
  }
  li {
    cursor: grab;
  }
  .sortable-ghost {
    opacity: 0.5;
  }
  .invisible {
    display: none;
  }
</style>