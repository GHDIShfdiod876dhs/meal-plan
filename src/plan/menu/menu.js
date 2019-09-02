import { writable, derived } from 'svelte/store';

function createMenu() {
  const { subscribe, update } = writable([]);

  return {
    subscribe,
    reset: () => update(s => s.map(recipe => ({ ...recipe, servings: 0 }))),
    updateRecipe: (id, newData) => update(s => {
      const recipeIdx = s.findIndex(recipe => recipe.id === id);
      s[recipeIdx] = { id, ...newData };
      return s;
    }),
    setServingsForRecipe: (id, newServings) => update(s => {
      const recipeIdx = s.findIndex(recipe => recipe.id === id);
      s[recipeIdx].servings = newServings;
      return s;
    }),
    updateServingsForRecipe: (id, newServings) => update(s => {
      const recipeIdx = s.findIndex(recipe => recipe.id === id);
      s[recipeIdx].servings = newServings + (s[recipeIdx].servings || 0);
      return s;
    }),
    add: (recipe) => update(s => [...s, recipe])
  };
};

export const menu = createMenu();

export const query = writable('');

export const matches = derived(
  [menu, query],
  ([$menu, $query]) => $menu.filter(item => item.name.toLowerCase().includes($query.toLowerCase()))
);