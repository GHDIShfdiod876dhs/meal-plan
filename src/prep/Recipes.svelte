<script>
  import { onMount } from 'svelte';
  import { fly, draw, slide } from 'svelte/transition';
  import { elasticInOut } from 'svelte/easing';
  import data from './MockData.js';
  import { capitalize, getTotal } from '../scripts/utils.js';

  let recipes = data.map(({name, ingredients, steps}) => ({
    name,
    ingredients: ingredients.map(ingredient => ({
      name: ingredient.name,
      amount: getTotal(ingredient.preps.map(prep => prep.amount))
    })),
    steps: steps.map(step => ({
      instruction: step,
      done: false,
    })),
    expand: true,
    done: false
  }))

  console.table(recipes)

  let recipesList;

  onMount(() => {
    recipes = recipes.map((recipe, idx) => ({
      ...recipe,
      textWidth: Math.ceil(
        recipesList.childNodes[idx]
          .querySelector('text')
          .getComputedTextLength()
      )
    }));
  });

  function toggleRecipe(recipe, idx) {
    recipes[idx] = { ...recipe, expand: !recipe.expand};
  }

  function toggleStep(recipe, idx, step) {
    step.done = !step.done;
    if (recipe.steps.every(step => step.done === true)) {
      recipes[idx] = { ...recipe, done: true, expand: false };
    } else {
      recipes[idx] = { ...recipe, done: false };
    }
  }

  // parse ingredient list for ingredient amounts?

  // when checking off 'Weigh' step, prompt user to enter weight
  // store entry in db
</script>


<main
  transition:fly={{ x: 300, duration: 300 }}>
  <ul
    class='ul'
    bind:this={recipesList}
    >
    {#each recipes as recipe, idx}
      <li class='recipe'>
        <label on:click|preventDefault={() => toggleRecipe(recipe, idx)}>
          <input
            type='checkbox'
            class='invisible-checkbox'
            bind:checked={recipe.done} />
          <span class='recipe-toggle' class:collapsed={!recipe.expand}>
            ►
          </span>
          <svg height='20'>
            <text x='0' y='15' style='stroke:hsl(217, 71%, 53%); stroke-width:1'>
              {capitalize(recipe.name)}
            </text>
            {#if recipe.done}
              <line
                x1='0'
                y1='10'
                x2={recipe.textWidth + 'px'}
                y2='10'
                style='stroke:#333; stroke-width:2'
                transition:draw={{ duration: 300, delay: 0, easing: elasticInOut }} />
            {/if}
          </svg>
        </label>
          {#if recipe.expand}
            <ul class='ul ingredients' transition:slide|local>
              {#each recipe.ingredients as ingredient}
                <li>
                  <em>{ingredient.amount} {capitalize(ingredient.name)}</em>
                </li>
              {/each}
            </ul>
            <ul class='ul' transition:slide|local>
              {#each recipe.steps as step}
                <li>
                  <label>
                    <input
                      type='checkbox'
                      checked={step.done}
                      on:change={() => toggleStep(recipe, idx, step)} />
                    <span>{capitalize(step.instruction)}</span>
                  </label>
                </li>
              {/each}
            </ul>
          {/if}
      </li>
    {/each}
  </ul>
</main>


<style>
  .ul {
    list-style: none;
    position: relative;
    left: -1rem;
  }
  .recipe {
    margin-top: 2rem;
  }
  .recipe:nth-child(1) {
    margin-top: 0;
  }
  .invisible-checkbox {
    opacity: 0;
    cursor: pointer;
    width: 0;
    margin: 0;
  }
  .recipe-toggle {
    left: -1rem;
    display: inline-block;
    transition: transform 0.2s ease-in-out;
    transform: rotate(90deg);
  }
  .recipe-toggle.collapsed {
    transform: rotate(0deg);
  }
  svg {
    display: block;
    position: relative;
    top: -1.5rem;
    left: 2rem;
    margin: 0;
    margin-bottom: -1.25rem;
    padding: 0;
  }
  .ingredients {
    font-size: 0.9rem;
    line-height: 1.2;
    border-radius: 2px;
    border: 1px solid hsl(240, 8%, 70%);
    background-color: hsl(240, 8%, 93%);
    padding: 0.5rem 1.5rem;
  }
</style>