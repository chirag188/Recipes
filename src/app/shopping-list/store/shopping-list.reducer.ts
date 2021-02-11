import { Ingredient } from '../../shared/ingredient.model';
import { Action } from '@ngrx/store';
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENTS = 'UPDATE_INGREDIENTS';
export const DELETE_INGREDIENTS = 'DELETE_INGREDIENTS';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';


export interface State{
  ingredients:Ingredient[];
  editedIngredients:Ingredient;
  editedIngredientsIndex:number;
}
// export interface AppState{
//   shoppingList:State;
// }
export class AddIngredient implements Action {
  type = ADD_INGREDIENT;
  static payload:Ingredient;
}
export class AddIngredients implements Action {
  type = ADD_INGREDIENTS;
  static payload:Ingredient[];
}
export class UpdateIngredients implements Action {
  type = UPDATE_INGREDIENTS;
  static index:number;
  static updateIngredient:Ingredient;
}
export class DeleteIngredients implements Action {
  type = DELETE_INGREDIENTS;
  static payload:number;
}
export class StartEdit implements Action {
  type = START_EDIT;
  static payload:number;
}
export class StopEdit implements Action {
  type = STOP_EDIT;
  static payload:number;
}
export type ShoppingAction = 
  | AddIngredient
  | AddIngredients
  | UpdateIngredients
  | DeleteIngredients
  | StartEdit
  | StopEdit;

const initialState:State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredients:null as any,
  editedIngredientsIndex:-1
};
export function shoppingListReducer(
  state = initialState,
  action: ShoppingAction
) {
  switch (action.type) {
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, AddIngredient.payload]
      };
    case ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...AddIngredients.payload]
      };
    case UPDATE_INGREDIENTS:
      const ingredient = state.ingredients[state.editedIngredientsIndex];
      const updatedIngredient = {
        ...ingredient,
        ...UpdateIngredients.updateIngredient
      }
      const updatedIngredients =[...state.ingredients];
      updatedIngredients[state.editedIngredientsIndex] = new Ingredient(updatedIngredient.name,updatedIngredient.amount);
      return {
        ...state,
        ingredients: updatedIngredients
      };
    case DELETE_INGREDIENTS:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig,index) => {
          return index!=DeleteIngredients.payload
        })
      };
    case START_EDIT:
      return{
        ...state,
        editedIngredientsIndex:StartEdit.payload,
        editedIngredients:{...state.ingredients[StartEdit.payload]}
      };
    case STOP_EDIT:
      return{
        ...state,
        editedIngredientsIndex:-1,
        editedIngredients:null as any
      };
    default:
      return state;
  }
}