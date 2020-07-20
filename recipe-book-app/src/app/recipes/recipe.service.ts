import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
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

    constructor(private shoppingListService: ShoppingListService) { }

    getRecipes() {
        return this.recipes.slice(); // Return copy, not original recipes
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    getRecipe(id: number) {
        const recipe = this.recipes[id]; // Synchronous code. Resolves instantly.
        return recipe;
    }
}