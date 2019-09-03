<script>
  import { getContext, afterUpdate } from 'svelte';
  import { capitalize } from '../../scripts/utils.js';
  import { db } from '../../scripts/firebase.js';
  import { user } from '../../scripts/user.js';
  import Spinner from '../../components/Spinner.svelte';
  import AddNameModal from './dropdown-menu/AddNameToCalendarModal.svelte';
  import ChangeNameModal from './dropdown-menu/ChangeNameModal.svelte';
  import Calendar from './Calendar.svelte';
  import Tabs from '../../components/Tabs.svelte';
  import DropdownMenu from './dropdown-menu/DropdownMenu.svelte';

  const namesRef =
    db.collection('plans')
      .doc($user.uid)
      .collection('names');
      
  let tabs = [];
  let currentTab;
  const setCurrentTab = tab => currentTab = tab;
  let loading = true;
  let modalOpen = false;

  namesRef.orderBy('created').onSnapshot(snapshot => {
    loading = false;
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        tabs = [...tabs, generateTab(change.doc.id, change.doc.data())];
      }
      if (change.type === 'modified') {
        const updateIdx = tabs.findIndex(tab => tab.id === change.doc.id);
        tabs[updateIdx] = generateTab(change.doc.id, change.doc.data());
        tabs = [...tabs];
        document.querySelectorAll('.tab')[updateIdx].click();
      }
    });
  });
 
  function generateTab(id, { name }) {
    const nameRef = namesRef.doc(id);
    return {
      id,
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
      component: AddNameModal,
      props: { name, handleSubmit },
    });
  }

  function changeName() {
    modalOpen = true;
    const { header: name, id } = currentTab;
    const handleSubmit = (newName) =>  
      namesRef.where('name', '==', newName).get().then(snapshot => {
        if (snapshot.empty) {
          return namesRef.doc(id)
            .update({ name: newName })
            .then(
              () => {
                // console.log('Name successfully changed');
                return false;
              },
              error => {
                // console.error('Problem changing name:', error);
                return true;
              }
            );
        }
        else {
          // console.log('Name already exists');
          return true;
        }
      })
    getContext('MODAL').setModalContent({
      component: ChangeNameModal,
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
    <Tabs {tabs} {setCurrentTab} />
  {/if}
  <DropdownMenu {addName} {changeName} />
{/if}


<style>
  #loading {
    text-align: center;
  }
  @keyframes pulse {
    from {
      transform: scale(0.9);
    }
    to {
      transform: scale(1);
    }
  }
</style>
