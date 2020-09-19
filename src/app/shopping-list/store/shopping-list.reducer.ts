import {Ingredient} from '../../shared/ingredients.model';
import {ADD_INGREDIENT, AddIngredient} from './shopping-list.action';

const initialState = {
  ingredients: [
    new Ingredient('Apple', 5),
    new Ingredient('Tomatoes', 10),
  ]
};

// tslint:disable-next-line:typedef
export function shoppingListReducer(state = initialState, action: AddIngredient) {
  switch (action.type){
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
  }
}
