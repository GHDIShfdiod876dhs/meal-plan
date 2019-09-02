<script>
  export let inUse;
    // if it is inUse, modal should display message that recipe can't be deleted because it's being used
    // if it isn't ask user if they're sure they want to delete
    // if yes, delete
</script>


{#if inUse}
  <h3>Sorry, you can't delete this recipe while it's on your calendar</h3>
{:else}
  akdljfhla
{/if}