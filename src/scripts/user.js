import { auth } from './firebase.js';
import { writable } from 'svelte/store';

const loading = 'LOADING';

export const user = (function(initialState) {
  const { subscribe, set } = writable(initialState);

  return {
    subscribe,
    set,
    isLoading: () => {
      let val;
      subscribe(current => val = current)();
      return val === loading;
    },
    setToLoading: () => set(loading)
  }
})(loading);

auth.onAuthStateChanged(newUser => user.set(newUser));
