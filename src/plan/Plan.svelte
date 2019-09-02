<script>
  import { fade } from 'svelte/transition';
  import Wrapper from '../components/Wrapper.svelte';
  import Menu from './menu/Menu.svelte';
  import Calendars from './calendar/Calendars.svelte';
</script>

<Wrapper style={`max-width: var(--max-width)`}>
  <div class='plan'>
    <Menu />
    <Calendars />
  </div>
</Wrapper>

<style>
  .plan {
    display: grid;
    grid-template-rows: calc(45vh - var(--navbar-height)) 55vh;
    min-height: 100%;
    justify-content: center;
  }
</style>
