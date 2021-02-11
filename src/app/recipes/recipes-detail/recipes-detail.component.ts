import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipes } from '../recipes.model';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.css']
})
export class RecipesDetailComponent implements OnInit {
  recipe!: Recipes;
  // @Input() recipe!: Recipes;
  constructor(private recipeService:RecipeService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    // this.recipe = this.recipeService.recipeItem(this.route.snapshot.params['id']);
    this.route.params.subscribe((params:Params) => {
      this.recipe = this.recipeService.recipeItem(+params['id']);
    });
  }
  onAddtoShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.router.navigate(['/shopping-list'],{relativeTo:this.route});
  }
  onDelete(){
    this.recipeService.deleteRecipe(+this.route.snapshot.params['id']);
  }
  Manage(){
    const managerecipe = document.getElementById("managerecipe");
    managerecipe?.classList.toggle('open');
  }
}
