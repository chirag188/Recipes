import { Action } from "@ngrx/store";
import { Recipes } from "./recipes.model";

export const SET_RECIPES = "[Recipes] Set Recipes";
export const FETCH_RECIPES = "[Recipes] Fetch Recipes";
export const UPDATE_RECIPE = "[Recipes] Update Recipe";
export const DELETE_RECIPE = "[Recipes] Delete Recipe";
export const ADD_RECIPE = "[Recipes] Add Recipe";
export const STORE_RECIPE = "[Recipes] Store Recipes";

export class  SetRecipes implements Action{
    type = SET_RECIPES;
    static payload: Recipes[];
}
export class  FetchRecipes implements Action{
    type = FETCH_RECIPES;
}
export class  AddRecipe implements Action{
    static recipe:Recipes;
    type = ADD_RECIPE;
}
export class  UpdateRecipe implements Action{
    type = UPDATE_RECIPE;
    static index:number;
    static newRecipe:Recipes;
}
export class  DeleteRecipe implements Action{
    type = DELETE_RECIPE;
    static index:number;
}
export class  StoreRecipe implements Action{
    type = STORE_RECIPE;
    static recipe:Recipes;
}
export type RecipesAction = SetRecipes|FetchRecipes|AddRecipe|UpdateRecipe|DeleteRecipe|StoreRecipe;
export interface State{
    recipes:Recipes[];
}
const intialState:State = {
    recipes:[]
}
export function recipeReducer(state = intialState,action:RecipesAction){
    switch(action.type){
        case SET_RECIPES:
            return{
                ...state,
                recipes:[...SetRecipes.payload]
            }
        case ADD_RECIPE:
            return {
                ...state,
                recipes:[...state.recipes,AddRecipe.recipe]
            }
        case UPDATE_RECIPE:
            const updatedRecipe = {
                ...state.recipes[UpdateRecipe.index],
                ...UpdateRecipe.newRecipe };
            const updatedRecipes = [...state.recipes];
            updatedRecipes[UpdateRecipe.index] = updatedRecipe;
            return {
                ...state,
                recipes:updatedRecipes
            }
        case DELETE_RECIPE:
            return{
                ...state,
                recipes:state.recipes.filter((recipe,index) => {
                    return index !== DeleteRecipe.index;
                })
            }
        default:
            return state;
    }
}