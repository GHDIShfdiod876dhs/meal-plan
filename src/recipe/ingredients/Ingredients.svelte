<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { getRecipeRef, addNutritionData, subtractNutritionData } from '../../scripts/utils.js';
  import { db } from '../../scripts/firebase.js';
  import { user } from '../../scripts/user.js';
  import { updateShoppingList } from '../../scripts/updateShoppingList.js';
  import Pane from '../../components/Pane.svelte';
  import APISearch from './APISearch.svelte';
  import Ingredient from './Ingredient.svelte';

  export let params = {};

  let ingredients = [];
  const recipeRef = getRecipeRef(params);
  const aggregateRef =
    db.collection('plans').doc($user.uid).collection('currentWeekAggregate');
  const ingredientsRef = recipeRef.collection('ingredients');

  let initialEditState = {
    idx: null,
    amount: '',
    ingredient: '',
    prep: ''
  }
  let itemToEdit = initialEditState;
  const setItemToEdit = newItem => itemToEdit = newItem;
  const resetItemToEdit = () => itemToEdit = initialEditState;

  ingredientsRef
  .orderBy('created')
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        ingredients = [
          ...ingredients,
          { id: change.doc.id, ...change.doc.data() }
        ];
        // console.log('New ingredient:', change.doc.data());
      }
      if (change.type === 'modified') {
        const updateIdx = ingredients.findIndex(i => i.id === change.doc.id);
        ingredients[updateIdx] = { id: change.doc.id, ...change.doc.data() }//change.doc.data();
        ingredients = [...ingredients];
        // console.log('Modified ingredient:', change.doc.data());
      }
      if (change.type === 'removed') {
        ingredients = ingredients.filter(i => i.id !== change.doc.id)
        // console.log('Removed ingredient:', change.doc.data());
      }
    })
  });

  function addIngredient(newIngredient, cb) {
    let servings;
    db.runTransaction(transaction => {
      const p0 = aggregateRef.doc(params.id).get();
      const p1 = transaction.get(recipeRef);

      return Promise.all([p0, p1])
      .then(docs => {
        if (docs[0].exists) {
          servings = docs[0].data().servings;
          updateShoppingList({ id: params.id, servings }, -1);
        }
        const prevData = docs[1].data().nutritionData || {};
        const newData = addNutritionData(prevData, newIngredient);
        transaction.update(recipeRef, { nutritionData: newData });
        transaction.set(ingredientsRef.doc(), {
          created: Date.now(),
          ...newIngredient
        })
      })
    })
    .then(
      () => {
        if (servings) {
          updateShoppingList({ id: params.id, servings });
        }
        cb()
      },
      error => console.error('Error adding ingredient: ', error)
    );
  }

  function removeIngredient(ingredient) {
    ingredients = ingredients.filter(i => i.id !== ingredient.id);
    let servings;
    db.runTransaction(transaction => {
      const p0 = aggregateRef.doc(params.id).get();
      const p1 = transaction.get(recipeRef);

      return Promise.all([p0, p1])
      .then(docs => {
        if (docs[0].exists) {
          servings = docs[0].data().servings;
          updateShoppingList({ id: params.id, servings }, -1);
        }
        const prevData = docs[1].data().nutritionData || {};
        const newData = subtractNutritionData(prevData, ingredient);
        transaction.update(recipeRef, { nutritionData: newData });
        transaction.delete(ingredientsRef.doc(ingredient.id));
      })
    })
    .then(
      () => {
        if (servings) {
          updateShoppingList({ id: params.id, servings });
        }
        console.log('Ingredient successfully deleted!')
      },
      error => console.error('Error removing ingredient: ', error)
    );
  }

  function editIngredient(ingredient, cb) {
    removeIngredient(itemToEdit);
    addIngredient(ingredient, cb);
  }
</script>


<APISearch
  {addIngredient}
  {editIngredient}
  {...itemToEdit}
  {setItemToEdit}
  {resetItemToEdit} />

<ol
  type='none'
  style='list-style-type: none;'>
  {#each ingredients as item, idx (item)}
    <li
      class:edit='{itemToEdit.idx === idx}'
      transition:fly|local={{ x: -300, duration: 300 }}
      animate:flip={{ duration: 300 }}>
      <Pane>
        <Ingredient
          {item}
          {idx}
          {setItemToEdit}
          {removeIngredient} />
      </Pane>
    </li>
  {/each}
</ol>


<style>
  ol {
    margin-left: 0;
    list-style-position: outside;
  }
  .edit {
    opacity: 0.5;
  }
</style>