import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertComponent } from "./alert/alert/alert.component";
import { DropDownDirective } from "./dropdown.directive";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";

@NgModule({
    declarations:[
        AlertComponent,
        PlaceholderDirective,
        DropDownDirective,
        // LoadingSpinnerComponent,
    ],
    imports:[
        CommonModule,FormsModule,ReactiveFormsModule
    ],
    exports:[
        AlertComponent,
        PlaceholderDirective,
        DropDownDirective,
        // LoadingSpinnerComponent,
        CommonModule,
    ],
    entryComponents:[AlertComponent]
})
export class SharedModule{}