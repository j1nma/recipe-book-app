import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class DataStorageService {

    constructor(
        private http: HttpClient,
        private recipeServices: RecipeService,
        private store: Store<fromApp.AppState>
    ) { }

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
                    // this.recipeServices.setRecipes(recipes);
                    this.store.dispatch(new RecipesActions.SetRecipes(recipes));
                })
            );
        // Here we don't need to subscribe from the triggering/calling component
    }
}