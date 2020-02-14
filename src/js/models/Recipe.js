import axios from 'axios';
import * as config from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`${config.recipeEndpoint}?key=${config.apiKey}&rId=${this.id}`);
      console.log(res);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert('Something went wrong :(');
    }
  }

  calcTime() {
    // Assuming it takes 15 min for every 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }
}
