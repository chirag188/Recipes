import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from 'rxjs';
import { Ingredient } from "../shared/ingredient.model";
import * as fromApp from '../app.reducer';
import * as shoppingListReducer from './store/shopping-list.reducer';

@Injectable()
export class ShoppingListService{
    // ingredientschanged = new EventEmitter<Ingredient[]>();
    constructor(private store: Store<fromApp.AppState>) { }
    // constructor(private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>){};
    ingredientschanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();
    private ingredients!:Ingredient[]; //= [
    //     new Ingredient('Apples',5),
    //     new Ingredient('Banana',6)  
    // ];
    getIngredients(){
        this.store.select('shoppingList').subscribe(
            ingredient => this.ingredients = ingredient.ingredients
          )
        // console.log(this.ingredients);
        return this.ingredients.slice();
    }
    getIngredient(index:number){
        // console.log(this.ingredients);
        return this.ingredients[index];
    }
    deleteIngredient(index:number){
        //this.ingredients.splice(index,1);
        const newIngredients = new shoppingListReducer.DeleteIngredients();
        shoppingListReducer.DeleteIngredients.payload = index;
        this.store.dispatch(newIngredients);
        this.ingredientschanged.next(this.ingredients.slice());
        shoppingListReducer.DeleteIngredients.payload = null as any;
    
    }
    updateIngredient(newIngredient:Ingredient){
        // this.ingredients[index] = newIngredient;
        const newIngredients = new shoppingListReducer.UpdateIngredients();
        // shoppingListReducer.UpdateIngredients.index = index;
        shoppingListReducer.UpdateIngredients.updateIngredient = newIngredient;
        this.store.dispatch(newIngredients);
        this.ingredientschanged.next(this.ingredients.slice());
    }
    checkItem(newIngredient:Ingredient){
        var index = this.ingredients.map(function(e) { return e.name; }).indexOf(newIngredient.name);
        if(index!==-1){
            this.updateIngredient(newIngredient);
            return true;
        }
        return false;
    }
    addIngredient(ingredient:Ingredient){
        const newIngredients = new shoppingListReducer.AddIngredient();
        shoppingListReducer.AddIngredient.payload = ingredient;
        this.store.dispatch(newIngredients);
        // this.ingredients.push(ingredient);
        // this.ingredientschanged.emit(this.ingredients.slice());
        this.ingredientschanged.next(this.ingredients.slice());
    }
    addIngredients(ingredients:Ingredient[]){
        // for(let ingredient of ingredients){
        //     this.addIngredient(ingredient);
        // }
        this.ingredients.push(...ingredients);
        this.ingredientschanged.next(this.ingredients.slice());
        // this.ingredientschanged.emit(this.ingredients.slice());
    }
}