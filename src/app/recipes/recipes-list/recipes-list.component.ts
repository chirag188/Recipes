import { Component, Injectable, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { RecipeService } from '../recipe.service';
import { Recipes } from '../recipes.model';
import * as fromApp from '../../app.reducer';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {
  recipes!:Recipes[];
  subscription!:Subscription;
  constructor(private recipeService:RecipeService,private store:Store<fromApp.AppState>) { }
  ngOnInit(): void {
    // this.recipeService.recipeChanged
    this.subscription = this.store.select('recipes')
    .pipe(map(recipesState => recipesState.recipes))
    .subscribe(
      (recipe:Recipes[]) => {
        this.recipes = recipe;
    });
    // this.recipes = this.recipeService.getRecipes();
  }
  setRecipes(){
    //this.recipes = this.recipeService.getRecipesFromServer();
  }
}