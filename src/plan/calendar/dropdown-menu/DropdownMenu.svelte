<script>
  import { getContext } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { db } from '../../../scripts/firebase.js';
  import { user } from '../../../scripts/user.js';
  import Pane from '../../../components/Pane.svelte';
  import ClearCalendarsModal from './ClearCalendarsModal.svelte';
  import AddNameModal from './AddNameToCalendarModal.svelte';
  import ChangeNameModal from './ChangeNameModal.svelte';
  import DeleteNameModal from './DeleteNameModal.svelte';

  export let tabs;
  export let currentTab;
  export let namesRef;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const { setModalContent } = getContext('MODAL')

  let menuVisible = false;
  const toggleMenu = () => menuVisible = !menuVisible;

  function clearCalendars() {
    const handleSubmit = () => {
      const promises = [];
      const aggregateRef = 
        db.collection('plans')
          .doc($user.uid)
          .collection('currentWeekAggregate');
      const shoppingListRef =
        db.collection('shopping lists')
          .doc($user.uid)
          .collection('items');

      promises.push(
        aggregateRef
        .get()
        .then(snapshot =>
          snapshot.forEach(doc =>
            aggregateRef.doc(doc.id).delete()
          )
        )
      );

      tabs.forEach(tab =>
        days.forEach(day => {
          const dayRef =
            namesRef.doc(tab.id)
              .collection('currentWeek')
              .doc(day)
              .collection('meals')
          promises.push(
            dayRef
            .get()
            .then(snapshot =>
              snapshot.forEach(doc =>
                dayRef.doc(doc.id).delete()
              )
            )
          );
        })
      );

      promises.push(
        shoppingListRef
        .get()
        .then(snapshot =>
          snapshot.forEach(doc =>
            shoppingListRef.doc(doc.id).delete()
          )
        )
      );

      return Promise.all(promises);
    }
    setModalContent({
      component: ClearCalendarsModal,
      props: { handleSubmit },
    });
  }

  function addName() {
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
    setModalContent({
      component: AddNameModal,
      props: { name: '', handleSubmit },
    });
  }

  function deleteName() {
    const { header: name, id } = currentTab;
    const handleSubmit = () =>      
      namesRef.doc(id)
      .delete()
      .then(
        () => console.log('Name successfully deleted'),
        error => console.error('Problem deleted name:', error)
      );

    const promises = [];
    days.forEach(day => promises.push(
      namesRef.doc(id)
      .collection('currentWeek')
      .doc(day)
      .collection('meals')
      .get()
      .then(snapshot => {
        console.log(day, !snapshot.empty)
        return !snapshot.empty
      })
    ));

    Promise.all(promises)
    .then(results => {
      const inUse = results.some(result => result === true);
      setModalContent({
        component: DeleteNameModal,
        props: { name, inUse, handleSubmit },
      })
    });
  }

  function changeName() {
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
    setModalContent({
      component: ChangeNameModal,
      props: { name, handleSubmit },
    });
  }
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
          <span on:click={clearCalendars}>Clear all</span>
          <span on:click={addName}>Add name</span>
          <span on:click={deleteName}>Delete name</span>
          <span on:click={changeName}>Change name</span>
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
