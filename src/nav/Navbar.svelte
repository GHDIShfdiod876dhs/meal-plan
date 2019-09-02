<script>
  import Login from './Login.svelte';
</script>

<div class='placeholder'></div>

<nav>
  <h3>MealPlan</h3>
  <Login />
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--navbar-height);
    background-color: hsl(240, 8%, 93%);
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 2px rgba(10,10,10,.1);
    border: 1px solid hsl(240, 8%, 70%);
    z-index: 100;
  }
  .placeholder {
    position: relative;
    height: 3rem;
    background: transparent;
  }
</style>