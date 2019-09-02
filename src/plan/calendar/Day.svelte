<script>
  import { getContext } from 'svelte';
  import { writable, derived } from 'svelte/store';
  import { scale } from 'svelte/transition';
  import { db, FieldValue } from '../../scripts/firebase.js';
  import { user } from '../../scripts/user.js';
  import { updateShoppingList } from '../../scripts/updateShoppingList.js';
  import { menu } from '../menu/menu.js';
  import Pane from '../../components/Pane.svelte';
  import Meal from './Meal.svelte';
  import NutritionDetails from '../nutrition-details/NutritionDetails.svelte';
  import DayNutrition from './DayNutrition.svelte';

  export let day;
  export let dayIdx;
  export let dayRef;

  export let meals;
  const mealsForDay = derived(
    meals,
    $meals => $meals[dayIdx]
  );

  const aggregateRef =
    db.collection('plans')
      .doc($user.uid)
      .collection('currentWeekAggregate');

  const shoppingListRef =
    db.collection('shopping lists')
    .doc($user.uid)
    .collection('items');
      
  dayRef.collection('meals').onSnapshot(snapshot =>
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        meals.add(change.doc.data(), dayIdx);
        // console.log('New meal:', change.doc.data());
      }
      if (change.type === 'modified') {
        meals.update(change.doc.data(), change.doc.id, dayIdx);
        // console.log('Modified meal:', change.doc.data());
      }
      if (change.type === 'removed') {
        meals.remove(change.doc.id, dayIdx);
        // console.log('Removed meal:', change.doc.data());
      }
    })
  );

  function handleDrop(evt) {
    const id = evt.dataTransfer.getData('id');
    if ($mealsForDay.find(recipe => recipe.id === id)) {
      return;
    }
    const meal = { ...$menu.find(recipe => recipe.id === id), servings: 1 };
    console.log(meal);

    const batch = db.batch();
    batch.set(
      aggregateRef.doc(meal.id),
      { servings: FieldValue.increment(meal.servings)},
      { merge: true }
    );
    batch.set(
      dayRef.collection('meals').doc(meal.id),
      meal
    );
    batch.commit()
    .then(
      () => {/*console.log('Meal successfully added')*/},
      error => console.error('Error adding meal:', error)
    );
    updateShoppingList(meal);
  }

  function removeMeal(meal) {
    const batch = db.batch();
    batch.set(
      aggregateRef.doc(meal.id),
      { servings: FieldValue.increment(-meal.servings) },
      { merge: true }
    );
    batch.delete(dayRef.collection('meals').doc(meal.id));
    batch.commit()
    .then(
      () => {/*console.log('Meal successfully removed')*/},
      error => console.error('Error removing meal:', error)
    );
    updateShoppingList(meal, -1);
  }

  function updateServingsForMeal(id, servings) {
    dayRef.collection('meals').doc(id).update({ servings })
    .then (
      () => {/*console.log('Servings updated!')*/},
      error => console.error('Error updating servings:', error)
    );
  }

  function updateServingsForRecipe(id, diff) {
    aggregateRef.doc(id).set({
      servings: FieldValue.increment(diff)
    }, { merge: true });
    updateShoppingList({ id, servings: diff });
  }
</script>


<div
  class='day'
  style={`grid-area: 1 / ${dayIdx + 1}`}
  on:dragover|preventDefault
  on:dragenter|preventDefault
  on:drop={handleDrop}>
  
  <Pane>
    <strong>{day}</strong>
    <div class="day-scroll-wrapper">
      {#if $mealsForDay.length}
        {#each $mealsForDay as meal, i (meal.id)}
          <Meal
            {meals}
            {dayIdx}
            {meal}
            {removeMeal}
            {updateServingsForMeal}
            {updateServingsForRecipe} />
        {/each}
      {/if}
    </div>
  </Pane>
</div>

<div class='day-nutrition' style={`grid-area: 2 / ${dayIdx + 1}`}>
  <DayNutrition meals={mealsForDay} {dayIdx}/>
</div>


<style>
  .day {
    --day-name-margin-bottom: 0.5rem;
  }
  strong {
    display: block;
    margin-bottom: var(--day-name-margin-bottom);
  }

  .day-scroll-wrapper {
    overflow-y: scroll;
    overflow-x: hidden;
    height: calc(100% - 0.25rem - (var(--day-name-margin-bottom) + 1rem));
    margin: -0.25rem;
  }

  @media only screen and (max-width: 700px) {
    .day {
      scroll-snap-align: start;
    }
  }
</style>