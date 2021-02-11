import { Component, OnInit } from '@angular/core';
import { RecipeService } from './recipe.service';
import { Recipes } from './recipes.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  // selectedRecipe:Recipes | undefined;
  constructor(private recipeService:RecipeService) { }

  ngOnInit() {
    // this.recipeService.recipeSelectd.subscribe((recipe:Recipes) => {
    //   this.selectedRecipe = recipe;
    // });
  }

}
