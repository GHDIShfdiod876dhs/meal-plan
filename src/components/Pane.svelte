<script>
  export let theme;
</script>

<div class='pane' class:light="{theme === 'LIGHT'}">
  <slot></slot>
</div>

<style>
  .pane {
    height: 100%;
    width: 100%;
    line-height: 1.2;
    margin: 0 0 0.5rem 0;
    padding: 0.5rem;
    border-radius: 2px;
    border: var(--dark-border);
    background-color:var(--dark-bg);
    box-shadow: var(--shadow);
  }
  .light {
    border: var(--light-border);
    background-color: var(--light-bg);
  }
</style>