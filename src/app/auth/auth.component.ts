import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthService,AuthResponseData } from './auth.service';
import * as fromApp from "../app.reducer";
import * as AuthActions from "./auth.reducer";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit,OnDestroy {
  @ViewChild(PlaceholderDirective) alertHost!: PlaceholderDirective; 
  isLoginMode = true;
  isLoading = false;
  error = "";
  closesub!:Subscription;
  storesub!:Subscription;
  constructor(private authService:AuthService,
    public viewContainerRef:ViewContainerRef,
    private router:Router,
    private componentFactoryResolver:ComponentFactoryResolver,
    private store:Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.storesub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if(this.error){
        this.showErrorAlert(this.error);
      }
    });
  }
  switch(){
    this.isLoginMode=!this.isLoginMode;
    this.error ="";
  }
  onSubmit(form:NgForm){
    this.isLoading = true;
    let authObs:Observable<AuthResponseData> = null as any;
    AuthActions.AuthenticateSuccess.redirect = true;
    if(this.isLoginMode){
      // authObs = this.authService.login(form.value.email,form.value.password);
      AuthActions.LoginStart.email = form.value.email;
      AuthActions.LoginStart.password = form.value.password;
      this.store.dispatch(new AuthActions.LoginStart());
    } else {
      AuthActions.SignupStart.email = form.value.email;
      AuthActions.SignupStart.password = form.value.password;
      this.store.dispatch(new AuthActions.SignupStart());
      // authObs = this.authService.signup(form.value.email,form.value.password);
    }
    // authObs.subscribe(responseData => {
    //   // this.router.navigate(["/recipes"]);
    //   this.isLoading = false;
    // }
    // ,errorRes => {
    //   this.error = errorRes;
    //   this.showErrorAlert(this.error);
    //   this.isLoading = false;
    // });
    form.reset();
  }
  onHandleError(){
    // this.error = "";
    this.store.dispatch(new AuthActions.ClearError());
  }
  showErrorAlert(message:string){
    const alertcmpfactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef =  hostViewContainerRef.createComponent(alertcmpfactory);
    componentRef.instance.message = message;
    this.closesub = componentRef.instance.close.subscribe(() => {
      this.closesub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
  ngOnDestroy(){
    if(this.closesub){
      this.closesub.unsubscribe();
    }
    if(this.storesub){
      this.storesub.unsubscribe();
    }
  }
}