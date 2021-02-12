import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Recipes } from '../recipes/recipes.model';
import { RecipeService } from '../recipes/recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as RecipesActions from '../recipes/recipes.reducer';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService,private store:Store<fromApp.AppState>) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://angular-backend-7954d-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipes[]>(
        'https://angular-backend-7954d-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map(recipes => {
          // this.recipeService.setRecipes(recipes);
          RecipesActions.SetRecipes.payload = recipes;
          this.store.dispatch(new RecipesActions.SetRecipes());
          return recipes;
          
          // return recipes.map(recipe => {
          //   return {
          //     ...recipe,
          //     ingredients: recipe.ingredients ? recipe.ingredients : []
          //   };
          // });
        }),
        // tap(recipes => {
        //   this.recipeService.setRecipes(recipes);
        // })
      )
  }
}
