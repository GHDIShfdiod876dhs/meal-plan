<script>
  import { auth, googleProvider } from '../scripts/firebase.js';
  import { user } from '../scripts/user.js';
  import img from '../static/julian-hanslmaier-bWg-BeVJPG4-unsplash.jpg';

  function login() {
    user.setToLoading();
    auth.signInWithPopup(googleProvider);
  }
</script>


<div class='background'>
  <div class='overlay'>
    <div class='sign-in'>
      <h1>Take control of how you fuel your body</h1>
      <h3>Get started planning your meals now</h3>
      <img on:click={login} src='btn_google_signin_light_normal_web.png' alt='sign in with Google'>
    </div>
  </div>
</div>


<style>
  .background {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: 
      linear-gradient(rgba(0, 0, 0, 0.3), rgba(150, 150, 100, 0.3)),
      url('../static/julian-hanslmaier-bWg-BeVJPG4-unsplash.jpg');
    background-size: cover;
  }
  .overlay {
    height: 16rem;
    width: 50vw;
    min-width: 36rem;
    background: #333;
    background: rgba(33, 33, 33, 0.85);
    padding: 1rem;
    box-shadow: 0 1px 6px 2px rgba(0, 0, 0, 0.5);
  }
  .sign-in {
    color: var(--light-bg);
    font-style: italic;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
  }
  img {
    box-shadow: var(--shadow);
  }
</style>