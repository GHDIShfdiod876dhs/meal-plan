<script>
  export let displayName;
  export let photoURL;
  export let uid;
</script>


<div>
  <!-- <h3>Hi {displayName}!</h3> -->

  <img src={photoURL} width="30" alt="user avatar" />
  <!-- <p>Your userID is {uid}</p> -->
</div>


<style>
  div {
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    border-radius: 50%;
    margin: 0.5rem;
  }
</style>