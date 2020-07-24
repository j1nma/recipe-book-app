import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';


export class DataStorageService {

    constructor(private http: HttpClient,
        private recipeServices: RecipeService) { }

    storeRecipes() {
        const recipes = this.recipeServices.getRecipes();
        // PUT overwrites everything
        this.http
            .put(
                'https://ng-course-recipe-book-fcbcd.firebaseio.com/',
                recipes
            )
            .subscribe();
        // Here we don't need to subscribe from the triggering/calling component
    }

}