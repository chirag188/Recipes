import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { map, tap } from 'rxjs/operators';
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipes } from "./recipes.model";
import * as fromApp from '../app.reducer';
import * as shoppingListReducer from '../shopping-list/store/shopping-list.reducer';


@Injectable()
export class RecipeService{
    recipeSelectd = new EventEmitter<Recipes>();
    // id!:number;
    recipeChanged = new Subject<Recipes[]>();
//    baseApiUrl = "https://file.io"
    private recipes: Recipes[] = [];
    constructor(private shoppingListService:ShoppingListService,
      private store: Store<fromApp.AppState>,
      // private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>,
      private http:HttpClient){}
    storeRecipesToServer(){
        const recipes = this.recipes;
        this.http.put('https://angular-backend-7954d-default-rtdb.firebaseio.com/recipes.json',recipes)
        .subscribe(response => {
            console.log(response);
        });
    }
    setRecipes(recipes:Recipes[]){
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
    }
    getRecipesFromServer(){
        return this.http
      .get<Recipes[]>(
        'https://angular-backend-7954d-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map((recipes: any[]) => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap((recipes: any) => {
          this.recipes = recipes;
        })
      )
        // const promise = new Promise((resolve,reject) => {
        // this.http.get<Recipes[]>('https://angular-backend-7954d-default-rtdb.firebaseio.com/recipes.json')
        //     .subscribe(recipes => {
        //         this.recipes = recipes;
        //         this.recipeChanged.next(this.recipes.slice());
        //         console.log(this.recipes);
        //     });
        // });
        // console.log(this.recipes);
        // return this.recipes;
    }
    getRecipes(){
        return this.recipes.slice();
    }
    getRecipe(index:number){
        return this.recipes[index];
    }
    addRecipe(recipe:Recipes){
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }
    updateRecipe(index:number,recipe:Recipes){
        this.recipes[index] = recipe;
        this.recipeChanged.next(this.recipes.slice());
    }
    addIngredientsToShoppingList(ingredients:Ingredient[]){
        //this.shoppingListService.addIngredients(ingredients);
        const newIngredients = new shoppingListReducer.AddIngredients();
        shoppingListReducer.AddIngredients.payload = ingredients;
        this.store.dispatch(newIngredients);
    }
    recipeItem(id:number):Recipes{
        // this.id = this.recipes.findIndex(e => e.name === id);
        return this.recipes[id];
    }
    deleteRecipe(index:number){
        this.recipes.splice(index,1);
        this.recipeChanged.next(this.recipes.slice());
        this.http.delete('https://angular-backend-7954d-default-rtdb.firebaseio.com/recipes/'+index+".json").subscribe(() => {
          console.log("responseData");
        });;
    }
    // upload(file: File):Observable<any> { 
    //     const formData = new FormData();  
    //     formData.append("file", file, file.name); 
    //     return this.http.post(this.baseApiUrl, formData) 
    // }
}