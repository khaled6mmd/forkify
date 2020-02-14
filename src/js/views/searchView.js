import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 17) => {
  const limitedTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if ((acc + cur).length <= limit) {
        limitedTitle.push(cur);
      }
      // return value used as acc for next iteration
      return acc + cur;
    }, '');
    return `${limitedTitle.join(' ')}...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  const markup = (
    `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
      </a>
    </li>
    `
  );
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' or 'next'
// eslint-disable-next-line arrow-body-style
const createButton = (page, type) => {
  return (
    `
    <button class="btn-inline results__btn--${type}" data-goto=${(type === 'prev') ? page - 1 : page + 1}>
    <span>Page ${(type === 'prev') ? page - 1 : page + 1}</span>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${(type === 'prev') ? 'left' : 'right'}"></use>
      </svg>
    </button>
    `
  );
};

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    // First page. Only button to go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    // Buttons for previous page and next page
    button = (
      `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
      `
    );
  } else if (page === pages && pages > 1) {
    // Last page. Only button to go to previous page
    button = createButton(page, 'prev');
  }
  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// Takes an array of recipes that we get from the API
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // Render results of current page
  const start = (page - 1) * resPerPage;
  const end = start + resPerPage;

  // forEach automatically called with current el as arg
  recipes.slice(start, end).forEach(renderRecipe);

  // Render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
