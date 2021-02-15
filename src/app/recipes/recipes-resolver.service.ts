import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import * as fromApp from '../app.reducer';
import * as AuthActions from '../auth/auth.reducer';
import * as RecipesActions from './recipes.reducer';
import { Recipes } from './recipes.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipes[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipesService: RecipeService,
    private store:Store<fromApp.AppState>,
    private action$:Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const recipes = this.recipesService.getRecipes();

    // if (recipes.length === 0) {
    //   return this.dataStorageService.fetchRecipes();
    // } else {
    //   return recipes;
    // }
    return this.store.select('recipes').pipe(
      take(1),
      map(recipeState => {
      return recipeState.recipes;
    }),
    switchMap(recipes => {
      if(recipes.length === 0){
        this.store.dispatch(new AuthActions.AutoLogin());
        this.store.dispatch(new RecipesActions.FetchRecipes());
        return this.action$.pipe(ofType(RecipesActions.SET_RECIPES),take(1));
      } else {
        return of(recipes);
      }
    }));
  }
}
