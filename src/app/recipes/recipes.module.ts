import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { RecipeStartComponent } from "../recipe-start/recipe-start.component";
import { SharedModule } from "../shared/shared.module";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipesDetailComponent } from "./recipes-detail/recipes-detail.component";
import { RecipeItemComponent } from "./recipes-list/recipe-item/recipe-item.component";
import { RecipesListComponent } from "./recipes-list/recipes-list.component";
import { RecipesResolverService } from "./recipes-resolver.service";
import { RecipesComponent } from "./recipes.component";

const routes:Routes = [{
    // path:'recipes',component: RecipesComponent,children:[
    path:'',component: RecipesComponent,children:[
        { path: '',component:RecipeStartComponent,resolve: [RecipesResolverService]},
        { path: 'new',component:RecipeEditComponent,resolve: [RecipesResolverService]},
        { path: ':id',component:RecipesDetailComponent,resolve: [RecipesResolverService]},
        { path: ':id/edit',component:RecipeEditComponent,resolve: [RecipesResolverService]}
    ]},
];
@NgModule({
    declarations:[
        RecipesComponent,
        RecipesListComponent,
        RecipesDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent,
    ],
    imports:[RouterModule.forChild(routes),SharedModule,ReactiveFormsModule],
    exports:[
        RecipesComponent,
        RecipesListComponent,
        RecipesDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent,
        RouterModule,
    ],
})
export class RecipesModule{}