<div class='wrapper'>
  <div class='rect'></div>
  <div class='rect'></div>
  <div class='rect'></div>
</div>

<style>
  .wrapper {
    --height: 1.5rem;
    height: var(--height);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .rect {
    background: #333;
    border-radius: 2px;
    width: var(--height);
    height: calc(var(--height) / 8);
    opacity: 0.5;
  }
</style>