<script>
  import { getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Day from './Day.svelte';
  import WeekNutrition from './WeekNutrition.svelte';

  export let data;
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const meals = (() => {
    const { subscribe, update } = writable(Array(7).fill([]));
    return {
      subscribe,
      add: (meal, dayIdx) => update(s => {
        s[dayIdx] = [...s[dayIdx], meal];
        return s;
      }),
      remove: (mealId, dayIdx) => update(s => {
        s[dayIdx] = s[dayIdx].filter(meal => meal.id !== mealId);
        return s;
      }),
      update: (meal, mealId, dayIdx) => update(s => {
        const updateIdx = s[dayIdx].findIndex(meal => meal.id === mealId);
        s[dayIdx][updateIdx] = meal;
        return s;
      }),
      updateServingsForMeal: (mealId, servings, dayIdx) => update(s => {
        const updateIdx = s[dayIdx].findIndex(meal => meal.id === mealId);
        s[dayIdx][updateIdx].servings = servings;
        return s;
      })
    };
  })();
</script>


<div class='calendar'>
  {#each days as day, dayIdx}
    <Day
      {meals}
      {day}
      {dayIdx}
      dayRef={data.nameRef.collection('currentWeek').doc(day)} />
  {/each}

  <WeekNutrition {meals} />
</div>


<style>
  .calendar {
    align-self: center;
    justify-self: center;
    display: grid;
    grid-template-rows: 1fr calc(0.8 * 1.2 * 2 * 1rem + 1.5rem);
    grid-template-columns: repeat(7, calc(var(--max-width) / 7));
    overflow: scroll;
    flex-grow: 1;
    min-width: 100%;
    height: calc(55vh - 8.5rem);
    max-height: calc(55vh - 8.5rem);

    overflow-y: hidden;
  }

  @media only screen and (max-width: 700px) {
    .calendar {
      grid-template-columns: repeat(7, var(--max-width));
      width: var(--max-width);
      max-width: var(--max-width);
      scroll-snap-type: x mandatory;
    }
  }
</style>