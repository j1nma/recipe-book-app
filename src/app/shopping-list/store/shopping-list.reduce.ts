import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import { ADD_INGREDIENT } from './shopping-list.actions';

const initialState = {
    ingredients: [
        new Ingredient("Apples", 5),
        new Ingredient("Tomatoes", 10)
    ]
};


export function ShoppingListReducer(state = initialState, action: Action) {
    switch (action.type) {
        case ADD_INGREDIENT:
            // state.ingredients.push() // forbidden! state is not immutable!
            return {
                ...state,
                ingredients: [...state.ingredients, action]
            };
    }
}