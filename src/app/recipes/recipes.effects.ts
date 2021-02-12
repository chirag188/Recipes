import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { map, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { Recipes } from "./recipes.model";
import * as RecipesActions from './recipes.reducer';
import * as formApp from '../app.reducer';
import { Store } from "@ngrx/store";

@Injectable()
export class  RecipeEffects {
    @Effect()
    fetchRecipes = this.action$.pipe(ofType(RecipesActions.FETCH_RECIPES),switchMap(() => {
        return this.http.get<Recipes[]>(
            'https://angular-backend-7954d-default-rtdb.firebaseio.com/recipes.json'
            );
        }),
        map((recipes: any[]) => {
            return recipes?recipes.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                }
            })
            :null
        }),
        map((recipes: any) => {
            RecipesActions.SetRecipes.payload = recipes?recipes:[];
            return new RecipesActions.SetRecipes();
        })
    );
    @Effect({dispatch:false})
    storeRecipes = this.action$.pipe(ofType(RecipesActions.STORE_RECIPE),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
    // switchMap(() => {
        return this.http.put('https://angular-backend-7954d-default-rtdb.firebaseio.com/recipes.json',recipesState.recipes);
    }));
    constructor(private action$:Actions,private http:HttpClient,private store:Store<formApp.AppState>) {}
}