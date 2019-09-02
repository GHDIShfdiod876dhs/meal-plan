<script>
  import { auth, googleProvider } from '../scripts/firebase.js';
  import { user } from '../scripts/user.js';
  import Spinner from '../components/Spinner.svelte';
  import Profile from './Profile.svelte';
  import Navbar from './Navbar.svelte';
  import LoggedInLinks from './LoggedInLinks.svelte';

  function login() {
    user.setToLoading();
    auth.signInWithPopup(googleProvider);
  }

  const logout = () => auth.signOut();
</script>


{#if user.isLoading()}
  <Spinner />
{:else if $user}
  <div class='big-screen-links'>
    <LoggedInLinks />
  </div>
  <div>
    <Profile {...$user} />
    <div class='small-screen-links'>
      <LoggedInLinks {logout} />
    </div>
    <span id='logout' on:click={logout}>Logout</span>
  </div>
{:else}
  <img on:click={login} src='btn_google_signin_light_normal_web.png' alt='sign in with Google'>
{/if}


<style>
  div {
    display: flex;
  }
  span {
    line-height: 3rem;
    padding: 0 0.5rem;
  }
  .small-screen-links {
    display: none;
  }
  @media only screen and (max-width: 700px) {
    .big-screen-links {
      display: none;
    }
    #logout {
      display: none;
    }
    .small-screen-links {
      display: flex;
      align-items: center;
    }
  } 
</style>

