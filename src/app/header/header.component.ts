import { Component, OnInit , EventEmitter, Output, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from "rxjs/operators";
import { AuthService } from '../auth/auth.service';
import { RecipeService } from '../recipes/recipe.service';
import * as fromApp from '../app.reducer';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit,OnDestroy{
  @Output() featureSelected = new EventEmitter<string>();
  private usersub!:Subscription;
  loggedin = false;
  constructor(private recipeService:RecipeService,
    private dataStorageService:DataStorageService,
    private authSerivce:AuthService,
    private router:Router,
    private store:Store<fromApp.AppState>) {}

  ngOnInit() {
    this.usersub = this.store.select("auth").pipe(map(authState => authState.user)).subscribe(user => {
    // this.usersub = this.authSerivce.user.subscribe(user => {
      this.loggedin = !!user;
      if(!this.loggedin){
        this.router.navigate(['/auth']);
      }
    });
  }
  onSelect(feature:string){
    this.featureSelected.emit(feature);
  }
  saveRecipes(){
    this.recipeService.storeRecipesToServer();
  }
  onLogout(){
    this.authSerivce.logout();
  }
  fetchRecipes(){
    this.dataStorageService.fetchRecipes().subscribe();
  }
  ngOnDestroy(){
    this.usersub.unsubscribe();
  }
}
