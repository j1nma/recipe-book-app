import { EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe("Schnitzel", "This is simply a test", "https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg",
            [new Ingredient('Meat', 1),
            new Ingredient('French Fries', 20)]),
        new Recipe("Burger", "This is simply a test", "https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg",
            [new Ingredient('Buns', 2),
            new Ingredient('Meats', 1)])
    ];

    getRecipes() {
        return this.recipes.slice(); // Return copy, not original recipes
    }
}