import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DataStorageService {

    constructor(
        private http: HttpClient,
        private recipeServices: RecipeService,
        private authService: AuthService) { }

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
        return this.http
            .get<Recipe[]>(
                'https://ng-course-recipe-book-fcbcd.firebaseio.com/recipes.json'
            )
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }),
                tap(recipes => {
                    this.recipeServices.setRecipes(recipes);
                })
            );
        // Here we don't need to subscribe from the triggering/calling component
    }
}