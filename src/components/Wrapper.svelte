<script>
  import { fade } from 'svelte/transition';

  export let style = {}
  export let scrollable = false;
</script>

<main
  class='wrapper'
  class:scrollable={scrollable}
  style={style}
  in:fade={{ duration: 300, delay: 200 }}
  out:fade={{ duration: 300 }}>
  <slot></slot>
</main>

<style>
  .wrapper {
    color: #333;
    max-width: 36em;
    margin: 0 auto;
    height: calc(100% - 3rem - 3px);
  }
  .wrapper.scrollable {
    overflow: scroll;
    max-width: calc(100vw + 30px);
    width: calc(100vw + 30px);
    padding: 0 calc((100vw + 8px - 36rem) / 2 + 30px) 0 calc((100vw - 36rem) / 2);
  }

  @media only screen and (max-width: 700px) {
    .wrapper.scrollable {
      padding: 0 calc((102vw + 8px - var(--max-width)) / 2 + 30px) 0 calc((102vw - var(--max-width)) / 2);
    }
  }
</style>
