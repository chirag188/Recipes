import { Component, ElementRef, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as fromApp from '../../app.reducer';
import * as shoppingListReducer from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit ,OnDestroy{
  // @ViewChild('nameInput') nameInputRef!: ElementRef;
  @ViewChild('f') slform!: NgForm;
  // @ViewChild('amountInput') amountInputRef!: ElementRef;
  // @Output() ingredientAdded = new EventEmitter<{name:string,amount:number}>();
  //@Output() ingredientAdded = new EventEmitter<Ingredient>();
  subscription!:Subscription;
  editMode = false;
  editedItemIndex!:number;
  editedItem!: Ingredient;
  check = false;
  constructor(private shoppingListService:ShoppingListService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe( stateData => {
      if(stateData.editedIngredientsIndex > -1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredients;
        this.editedItemIndex = stateData.editedIngredientsIndex;
        this.slform.setValue({
          name:this.editedItem.name,
          amount:this.editedItem.amount
        });
      } else{
        this.editMode = false;
      }
    });
    // this.subscription = this.shoppingListService.startedEditing.subscribe((index:number) => {
    //   this.editedItemIndex = index;
    //   this.editMode = true;
    //   this.editedItem = this.shoppingListService.getIngredient(index);
    //   this.slform.setValue({
    //     name:this.editedItem.name,
    //     amount:this.editedItem.amount
    //   });
    // });
  }
  onAddItem(form:NgForm){
    // this.ingredientAdded.emit(new Ingredient(this.nameInputRef.nativeElement.value,this.amountInputRef.nativeElement.value));
    // this.shoppingListService.addIngredient(new Ingredient(this.nameInputRef.nativeElement.value,this.amountInputRef.nativeElement.value));
    const value = form.value;
    if(this.editMode){
      this.shoppingListService.updateIngredient(new Ingredient(value.name,value.amount));
    } else{
      this.check = this.shoppingListService.checkItem(new Ingredient(value.name,value.amount));
      if(!this.check){
        this.shoppingListService.addIngredient(new Ingredient(value.name,value.amount));
      }
    }
    this.editMode = false;
    form.reset();
  }
  onClear(){
    this.editMode = false;
    this.slform.reset();
    const stopObj = new shoppingListReducer.StopEdit();
    this.store.dispatch(stopObj);
  }
  onDelete(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
  ngOnDestroy(){  
    this.subscription.unsubscribe();
    this.store.dispatch(new shoppingListReducer.StopEdit());
  }
}