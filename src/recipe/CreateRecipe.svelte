<script>
  import { tick } from 'svelte';
  import { capitalize } from '../scripts/utils.js';
  import { db, auth } from '../scripts/firebase';
  import { push } from 'svelte-spa-router';
  import Spinner from '../components/Spinner.svelte';

  const { uid } = auth.currentUser;
  let input;
  let invalid = false;
  let loading = false;

  function handleSubmit(e) {
    if (input.value) {
      loading = true;
      const name = capitalize(input.value);
      db.collection('recipes')
      .where('uid', '==', uid)
      .where('name', '==', name)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => push(`/recipe/${doc.id}`));
        }
        else {
          db.collection('recipes')
          .add({
            uid,
            name,
            // servings: 0,
            servingsPerRecipe: 1,
            created: Date.now()
          })
          .then(res => {
            push(`/recipe/${res.id}`);
            loading = false;
          });
        }
      });
    }
    else {
      invalid = true;
      input.focus();
    }
  }
</script>


<div class='name'>
  <form on:submit|preventDefault={handleSubmit}>
    <div class='field has-addons'>
      <div class='control'>
        <input bind:this={input} class='input' type='text' placeholder='Recipe name'>
      </div>
      <div class='control'>
        <button id='submit' class='button' type='submit'>
          {#if loading}<Spinner />{:else}Save{/if}
        </button>
      </div>
    </div>
    {#if invalid}
      <div class='invalid'>Your recipe needs a name!</div>
    {/if}
  </form>
</div>


<style>
  .name {
    display: flex;
    justify-content: center;   
  }
  #submit {
    width: 3.75rem;
  }
  .invalid {
    color: red;
    text-align: center;
  }
</style>