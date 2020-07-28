import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];

    // private recipes: Recipe[] = [
    //     new Recipe("Schnitzel", "This is simply a test", "https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg",
    //         [new Ingredient('Meat', 1),
    //         new Ingredient('French Fries', 20)]),
    //     new Recipe("Burger", "This is simply a test", "https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg",
    //         [new Ingredient('Buns', 2),
    //         new Ingredient('Meats', 1)])
    // ];

    constructor(
        private shoppingListService: ShoppingListService,
        private store: Store<fromShoppingList.AppState>
    ) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes() {
        return this.recipes.slice(); // Return copy, not original recipes
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        // this.shoppingListService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients))
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}