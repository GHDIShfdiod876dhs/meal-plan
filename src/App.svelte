<script>
  import { setContext } from 'svelte';
  import { auth } from './scripts/firebase.js';
  import { user } from './scripts/user.js';
	import Router from 'svelte-spa-router';
  import Modal from './components/Modal.svelte';
  import Navbar from './nav/Navbar.svelte';
  import CreateRecipe from './recipe/CreateRecipe.svelte';
  import Recipe from './recipe/Recipe.svelte';
  import Prep from './prep/Prep.svelte';
  import ShoppingList from './shop/ShoppingList.svelte';
  import Plan from './plan/Plan.svelte';

	const routes = {
		'/create_recipe': CreateRecipe,
		'/recipe/:id': Recipe,
		'/prep': Prep,
		'/shop': ShoppingList,
		'*': Plan
	};

  let ModalComponent;
  let modalProps;
  let modalOpen = false;
  const modalClose = () => modalOpen = false;
  setContext('MODAL', {
    setModalContent: (newContent) => {
      ModalComponent = newContent.component;
      modalProps = newContent.props;
      modalOpen = true;
    }
  });
</script>


<Navbar />
{#if $user && !user.isLoading()}
  <Router {routes} />
{/if}

{#if modalOpen}
	<Modal {modalClose}>
    <ModalComponent {modalClose} {...modalProps} />
	</Modal>
{/if}
