import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipes } from '../recipes.model';
import * as fromApp from '../../app.reducer';
import * as RecipesActions from '../recipes.reducer';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.css']
})
export class RecipesDetailComponent implements OnInit {
  recipe!: Recipes;
  id!:number;
  // @Input() recipe!: Recipes;
  constructor(private recipeService:RecipeService,
    private router:Router,
    private route:ActivatedRoute,
    private store:Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // this.recipe = this.recipeService.recipeItem(this.route.snapshot.params['id']);
    this.route.params.pipe(map(params =>{
      return +params['id'];
    }),switchMap(id => {
        this.id = id;
      return this.store.select('recipes');
    }),
    map(recipeState =>{
      return recipeState.recipes.find((recipe,index) => {
        return index === +this.id;
      });
    }))
    // this.route.params.subscribe((params:Params) => {
      //this.recipe = this.recipeService.recipeItem(+params['id']);
      .subscribe(recipe => {
        this.recipe = recipe as any;
    });
  }
  onAddtoShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.router.navigate(['/shopping-list'],{relativeTo:this.route});
  }
  onDelete(){
    // this.recipeService.deleteRecipe(+this.route.snapshot.params['id']);
    RecipesActions.DeleteRecipe.index = +this.route.snapshot.params['id'];
    this.store.dispatch(new RecipesActions.DeleteRecipe());
  }
  Manage(){
    const managerecipe = document.getElementById("managerecipe");
    managerecipe?.classList.toggle('open');
  }
}
