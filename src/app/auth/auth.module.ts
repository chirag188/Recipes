import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { AuthComponent } from "./auth.component";

@NgModule({
    declarations:[
        AuthComponent,
        LoadingSpinnerComponent,
    ],
    imports:[
        RouterModule.forChild([{ path: '',component:AuthComponent}]),
        HttpClientModule,
        FormsModule,
        CommonModule,
    ],
    exports:[
        AuthComponent,
        LoadingSpinnerComponent,
    ]
})
export class AuthModule{}