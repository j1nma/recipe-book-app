import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';

@Injectable()
export class DataStorageService {

    constructor(private http: HttpClient,
        private recipeServices: RecipeService) { }

    storeRecipes() {
        const recipes = this.recipeServices.getRecipes();
        // PUT overwrites everything
        this.http
            .put(
                'https://ng-course-recipe-book-fcbcd.firebaseio.com/recipes.json',
                recipes
            )
            .subscribe();
        // Here we don't need to subscribe from the triggering/calling component
    }

    fetchRecipes() {
        this.http
            .get<Recipe[]>('https://ng-course-recipe-book-fcbcd.firebaseio.com/recipes.json')
            .subscribe(recipes => {
                this.recipeServices.setRecipes(recipes);
            });
        // Here we don't need to subscribe from the triggering/calling component
    }

}