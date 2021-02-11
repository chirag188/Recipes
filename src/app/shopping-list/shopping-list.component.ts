import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import * as fromApp from '../app.reducer';
import * as shoppingListReducer from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit,OnDestroy{
  ingredients!:Ingredient[]
  // ingredients!: Observable<{ ingredients: Ingredient[] }>;
  private idChangeSub !: Subscription;
  recipes: any;
  private subscription!:Subscription;
  constructor(private shoppingListService:ShoppingListService,
  private store: Store<fromApp.AppState>) { }
  // private store: Store<shoppingListReducer.AppState>) { }
  // private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) { }
  ngOnInit(): void {
    // this.ingredients = this.store.select('shoppingList');
    // this.subscription = this.store.select('shoppingList').subscribe(
    //   ingredient => this.ingredients = ingredient.ingredients
    // )
    this.ingredients = this.shoppingListService.getIngredients();
    //this.shoppingListService.ingredientschanged.subscribe((ingredient:Ingredient[]) => {
    this.idChangeSub = this.shoppingListService.ingredientschanged.subscribe((ingredient:Ingredient[]) => {
       this.ingredients = ingredient;
    });
  }
  ngOnDestroy(){
    // this.subscription.unsubscribe();
  }
  onEditItem(index:number){
    // this.shoppingListService.startedEditing.next(index);
    const startObj = new shoppingListReducer.StartEdit();
    // const startObj = new shoppingListReducer.StartEdit();
    // shoppingListReducer.StartEdit.payload = index;
    shoppingListReducer.StartEdit.payload = index;
    this.store.dispatch(startObj);
    shoppingListReducer.StartEdit.payload = null as any;
  }
  // onIngredientAdded(ingredient:Ingredient){
  //   this.ingredients.push(ingredient);
  // }
}
