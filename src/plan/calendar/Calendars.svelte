<script>
  import { getContext, afterUpdate } from 'svelte';
  import { capitalize } from '../../scripts/utils.js';
  import { db } from '../../scripts/firebase.js';
  import { user } from '../../scripts/user.js';
  import Spinner from '../../components/Spinner.svelte';
  import Modal from './AddNameToCalendarModal.svelte';
  import Calendar from './Calendar.svelte';
  import Tabs from '../../components/Tabs.svelte';
  import DropdownMenu from './DropdownMenu.svelte';

  const namesRef =
    db.collection('plans')
      .doc($user.uid)
      .collection('names');
  let tabs = [];
  let loading = true;
  let modalOpen = false;

  namesRef.orderBy('created').onSnapshot(snapshot => {
    loading = false;
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        tabs = [...tabs, generateTab(change.doc.id, change.doc.data())];
      }
    });
  });
 
  function generateTab(id, { name }) {
    const nameRef = namesRef.doc(id);
    return {
      nameRef,
      header: name,
      component: Calendar,
    }
  }

  function addName() {
    modalOpen = true;
    const name = tabs.length ? '' : $user.displayName;
    const handleSubmit = (newName) => {      
      namesRef.doc().set({
        created: Date.now(),
        name: newName,
      })
      .then(
        () => console.log('Name successfully added'),
        error => console.error('Problem adding name:', error)
      );
    };

    getContext('MODAL').setModalContent({
      component: Modal,
      props: { name, handleSubmit },
    });
  }

  afterUpdate(() => {
    if (!loading && !tabs.length && !modalOpen) {
      addName();
    }
  })
</script>



{#if loading}
  <div id='loading'>
    <Spinner />
  </div>
{:else}
  {#if tabs.length}
    <Tabs {tabs} />
  {/if}

  <!-- <div class='button-wrapper'> -->
    <!-- <button class='add-name' on:click={addName}>➕</button> -->
    <!-- {#if !tabs.length && !modalOpen}
      <div class='tooltip-wrapper'>
        <div class='arrow'></div>
        <div class='tooltip'>click to add a calendar</div>
      </div>
    {/if} -->
  <!-- </div> -->

  <DropdownMenu {addName} />

{/if}


<style>
  #loading {
    text-align: center;
  }
  /* .button-wrapper {
    /* display: flex;
    align-items: center;
    justify-content: flex-start; 
  } */
  /* .add-name {
    background: var(--light-bg);
    border: var(--light-border);
    width: 2rem;
    height: 2rem;
    margin: 0;
    position: absolute;
    top: calc(45vh + 0.5rem);
    right: calc((100vw - var(--max-width)) / 2);
    border-radius: 50%;
    font-size: .8rem;
    box-shadow: var(--shadow);
    line-height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  } */
  /* .tooltip-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    opacity: 0.9;
    animation: pulse 700ms ease-in-out 0ms infinite alternate;
  } */

  @keyframes pulse {
    from {
      transform: scale(0.9);
    }
    to {
      transform: scale(1);
    }
  }
  /* .tooltip {
    display: inline-block;
    background-color: #333;
    color: white;
    padding: 0.5rem;
    border-radius: 2px;
  } */
  /* .arrow {
    display: inline-block;
    height: 0;
    width: 0;
    border-bottom: 10px solid transparent;
    border-top: 10px solid transparent;
    border-right: 10px solid #333;
  } */
</style>
