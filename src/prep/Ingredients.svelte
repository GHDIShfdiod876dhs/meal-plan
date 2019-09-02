<script>
  import { fade, fly, slide, draw } from 'svelte/transition';
  import { elasticInOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import data from './MockData.js';
  import conversions from '../scripts/conversions.js';
  import { capitalize, getTotal } from '../scripts/utils.js';
  import { generatePastParticiple } from '../scripts/verbs.js';

  // console.log('data');
  // console.table(data);

  const ingredientsData = data.map(({ name, ingredients }) => ({
    name,
    ingredients
  }));

  // console.log('ingredientsData:');
  // console.table(ingredientsData);

  const flattenedIngredientsData = ingredientsData
    .map(recipe =>
      recipe.ingredients.map(ingredient => ({
        ...ingredient,
        recipe: recipe.name
      }))
    )
    .flat();

  // console.log('flattenedIngredientsData:');
  // console.table(flattenedIngredientsData);

  const recipeNameInPrepsArray = flattenedIngredientsData.map(
    ({ name, preps, recipe }) => ({ name, data: { recipe, preps } })
  );

  // console.log('recipeNameInPrepsArray:');
  // console.table(recipeNameInPrepsArray);

  const ingredientsWithActions = recipeNameInPrepsArray.filter(ingredient =>
    ingredient.data.preps.some(({ actions }) => actions.length > 0)
  );

  // console.log('ingredientsWithActions:');
  // console.table(ingredientsWithActions);

  const flattenedActionsData = ingredientsWithActions.map(({ name, data }) => ({
    name,
    preps: data.preps
      .map(prep =>
        prep.actions.map((action, idx) => ({
          action,
          recipes: [
            {
              amount: prep.amount,
              name: data.recipe,
              previousActions: prep.actions
                .slice(0, idx)
                .map(action => generatePastParticiple(action))
            }
          ]
        }))
      )
      .flat()
  }));

  // console.log('flattenedActionsData');
  // console.table(flattenedActionsData);

  const reducedIngredients = flattenedActionsData.reduce((acc, val) => {
    const idx = acc.findIndex(elem => elem.name === val.name);
    if (idx !== -1) {
      acc[idx] = {
        name: val.name,
        preps: [...acc[idx].preps, ...val.preps]
      };
      return [...acc];
    } else return [...acc, val];
  }, []);

  // console.log('reducedIngredients:');
  // console.table(reducedIngredients);

  const reducedActionsData = reducedIngredients.map(({ name, preps }) => ({
    name,
    preps: preps.reduce((acc, val) => {
      const idx = acc.findIndex(elem => elem.action === val.action);
      if (idx !== -1) {
        acc[idx] = {
          action: val.action,
          recipes: [...acc[idx].recipes, ...val.recipes]
        };
        return [...acc];
      } else return [...acc, val];
    }, [])
  }));

  // console.log('reducedActionsData:');
  // console.table(reducedActionsData);

  let ingredients = reducedActionsData.map(({ name, preps }) => ({
    name,
    preps: preps.map(({ action, recipes }) => ({
      action,
      totalAmount: getTotal(recipes.map(recipe => recipe.amount)),
      recipes,
      done: false
    })),
    done: false,
    expand: true
  }));

  // console.log('ingredients:');
  // console.table(ingredients);

  let ingredientsList;

  onMount(() => {
    ingredients = ingredients.map((ingredient, idx) => ({
      ...ingredient,
      textWidth: Math.ceil(
        ingredientsList.childNodes[idx]
          .querySelector('text')
          .getComputedTextLength()
      )
    }));
  });

  function toggleAction(ingredient, idx, prep) {
    prep.done = !prep.done;
    if (ingredient.preps.every(prep => prep.done === true)) {
      ingredients[idx] = { ...ingredient, done: true, expand: false };
    } else {
      ingredients[idx] = { ...ingredient, done: false };
    }
  }

  function toggleIngredient(ingredient, idx) {
    ingredients[idx] = { ...ingredient, expand: !ingredient.expand };
  }
</script>


<main transition:fly={{ x: -300, duration: 300 }}>
<ul
  class='ul'
  bind:this={ingredientsList}
  >
  {#each ingredients as ingredient, idx}
    <li class='ingredient'>
      <label on:click|preventDefault={() => toggleIngredient(ingredient, idx)}>
        <input
          type='checkbox'
          class='invisible-checkbox'
          bind:checked={ingredient.done} />
        <span class='ingredient-toggle' class:collapsed={!ingredient.expand}>
          ►
        </span>
        <svg height='20'>
          <text x='0' y='15' style='stroke:hsl(217, 71%, 53%); stroke-width:1'>
             {capitalize(ingredient.name)}
          </text>
          {#if ingredient.done}
            <line
              x1='0'
              y1='10'
              x2={ingredient.textWidth + 'px'}
              y2='10'
              style='stroke:#333; stroke-width:2'
              transition:draw={{ duration: 300, delay: 0, easing: elasticInOut }} />
          {/if}
        </svg>
      </label>
        {#if ingredient.expand}
          <ul class='ul' transition:slide|local>
            {#each ingredient.preps as prep}
              <li>
                <label>
                  <input
                    type='checkbox'
                    checked={prep.done}
                    on:change={() => toggleAction(ingredient, idx, prep)} />
                  <strong>{capitalize(prep.action)}</strong>
                  <span>{` - ${prep.totalAmount}`}</span>
                  <div class='recipes'>
                    {#each prep.recipes as recipe}
                      <div>
                        <em>
                           {`${recipe.name}: ${recipe.amount}`}
                          {#if recipe.previousActions && recipe.previousActions.length > 0}
                            <span class='previous-actions'>
                               {`(${recipe.previousActions.join(', ')})`}
                            </span>
                          {/if}
                        </em>
                      </div>
                    {/each}
                  </div>
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
  .ingredient {
    margin-top: 2rem;
  }
  .ingredient:nth-child(1) {
    margin-top: 0;
  }
  .invisible-checkbox {
    opacity: 0;
    cursor: pointer;
    width: 0;
    margin: 0;
  }
  .ingredient-toggle {
    left: -1rem;
    display: inline-block;
    transition: transform 0.2s ease-in-out;
    transform: rotate(90deg);
  }
  .ingredient-toggle.collapsed {
    transform: rotate(0deg);
  }
  .recipes {
    position: relative;
    left: 1rem;
  }
  .previous-actions {
    font-size: 0.9rem;
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
</style>