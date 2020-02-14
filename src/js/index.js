import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
search object
Current recipe object
Shopping list object
Liked recipes
*/
const state = {};

/**
 * Search Controller
 */
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();
  console.log(query);

  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes
      await state.search.getResults();

      // 5) Render results on UI
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert('Something wrong with the search...');
    } finally {
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', (event) => {
  // Stop automatic page load
  event.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', (event) => {
  /* Use closest() so that clicks on the button, svg,
   * or span all count as clicks on just the button */
  const btn = event.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
  // window.location gives the entire URL. hash is the # and what comes after the #
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare UI for changes
    console.log(id);

    // Create new recipe object
    state.recipe = new Recipe(id);

    // Get recipe data
    try {
      await state.recipe.getRecipe();

      // Calculate servings and time
      state.recipe.calcServings();
      state.recipe.calcTime();

      // Render recipe
      console.log(state.recipe);
    } catch (err) {
      alert('Error processing recipe!');
    }
  }
};

/* hashchange event fires whenever the id in url/?#id changes
window.addEventListener('hashchange', controlRecipe);

Also need to display results if user refreshes or loads page with given id
window.addEventListener('load', controlRecipe);

The loop below does both at once, since they use same callback */

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
