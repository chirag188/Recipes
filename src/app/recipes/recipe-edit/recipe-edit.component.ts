import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipes } from '../recipes.model';
import * as fromApp from '../../app.reducer';
import * as RecipesActions from '../recipes.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id!:number;
  editMode = false;
  recipeForm!:FormGroup;
  // shortLink: string = ""; 
  // loading: boolean = false; // Flag variable 
  // file!:File; // Variable to store file 
  constructor(private router:Router,
    private route:ActivatedRoute,
    private recipeService:RecipeService,
    private store:Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe((params:Params) => {
      this.id = +params['id'];
      this.editMode = params['id']!=null;
      this.initForm();
    });
  }
  onSubmit(){
    const value = this.recipeForm.value;
    const recipe = new Recipes(value.name,value.description,value.imagepath,value.ingredients);
    if(this.editMode){
      // this.recipeService.updateRecipe(this.id,recipe);
      RecipesActions.UpdateRecipe.index = this.id;
      RecipesActions.UpdateRecipe.newRecipe = recipe;
      this.store.dispatch(new RecipesActions.UpdateRecipe());
    } else {
      // this.recipeService.addRecipe(recipe);
      // this.recipeService.recipeSelectd.emit(recipe);
      RecipesActions.AddRecipe.recipe = recipe;
      this.store.dispatch(new RecipesActions.AddRecipe());
    }
    this.router.navigate(['/']);
  }
  onCancel(){
    this.router.navigate(['/']);
  }
  getControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
  addNewIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null,Validators.required),
        'amount': new FormControl(null,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    );
  }
  onRemove(index:number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
  private initForm(){
    let recipeName='';
    let recipeImagePath='';
    let recipeDescription='';
    let ingredients = new FormArray([]);
    if(this.editMode){
      this.store.select('recipes').pipe(map(recipeState => {
        return recipeState.recipes.find((recipe,index) => {
          return index === this.id;
        })
      }))
      .subscribe(recipe => {
        if(recipe){
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if(recipe['ingredients']){
            for(let i of recipe.ingredients){
          //ingredients.push(new FormGroup({'name':new FormControl(i.name),'amount': new FormControl(i.amount)}));
              ingredients.push(new FormGroup({
                'name':new FormControl(i.name,Validators.required),
                'amount': new FormControl(i.amount,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
              }));
            }
          }
        }
      })
      // const recipe = this.recipeService.getRecipe(this.id);
    }
    this.recipeForm = new FormGroup({
      'name':new FormControl(recipeName,Validators.required),
      'imagepath': new FormControl(recipeImagePath,Validators.required),
      'description': new FormControl(recipeDescription,Validators.required),
      'ingredients':<FormArray>ingredients,
    });
  }

//   onChange(event:any) { 
//     this.file = event.target.files[0]; 
// } 

// // OnClick of button Upload 
// onUpload() { 
//     this.loading = !this.loading; 
//     console.log(this.file); 
//     this.recipeService.upload(this.file).subscribe( 
//         (event: any) => { 
//             if (typeof (event) === 'object') { 
//                 this.shortLink = event.link; 
//                 this.loading = false; // Flag variable  
//             } 
//         } 
//     ); 
// }
}