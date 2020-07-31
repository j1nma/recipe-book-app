import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Recipe } from './recipe.model';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { take, map, switchMap } from 'rxjs/operators';

// Loads the data before the page loads
// for instance, when going to recipes/0 when having no recipes, it would be doomed to fail
// so an automatic fetchRecipes is done in the background,
// defined for specific routes
@Injectable()
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    // Only fetch new ones if we don't have any
    return this.store.select('recipes').pipe(
      take(1),
      map((recipesState) => {
        return recipesState.recipes;
      }),
      switchMap((recipes) => {
        if (recipes.length == 0) {
          this.store.dispatch(new RecipesActions.FetchRecipes());
          return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes); // don't send any request if we already have recipes
        }
      })
    );
  }
}
