import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// Loads the data before the page loads
// for instance, when going to recipes/0 when having no recipes, it would be doomed to fail
// so an automatic fetchRecipes is done in the background,
// defined for specific routes
@Injectable()
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService: DataStorageService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        return this.dataStorageService.fetchRecipes();
    }
}