import { Component, Injectable, OnInit} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { RecipeService } from '../recipe.service';
import { Recipes } from '../recipes.model';
@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {
  recipes!:Recipes[];
  constructor(private recipeService:RecipeService) { }
  ngOnInit(): void {
    this.recipeService.recipeChanged.subscribe(
      (recipe:Recipes[]) => {
        this.recipes = recipe;
    });
    this.recipes = this.recipeService.getRecipes();
  }
  setRecipes(){
    //this.recipes = this.recipeService.getRecipesFromServer();
  }
}