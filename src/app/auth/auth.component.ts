import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthService,AuthResponseData } from './auth.service';

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
  constructor(private authService:AuthService,public viewContainerRef:ViewContainerRef,private router:Router,private componentFactoryResolver:ComponentFactoryResolver) { }

  ngOnInit(): void {
  }
  switch(){
    this.isLoginMode=!this.isLoginMode;
    this.error ="";
  }
  onSubmit(form:NgForm){
    this.isLoading = true;
    let authObs:Observable<AuthResponseData>;
    if(!this.isLoginMode){
      authObs = this.authService.signup(form.value.email,form.value.password);
    } else {
      authObs = this.authService.login(form.value.email,form.value.password);
    }
    authObs.subscribe(responseData => {
      // this.router.navigate(["/recipes"]);
      this.isLoading = false;
    }
    ,errorRes => {
      this.error = errorRes;
      this.showErrorAlert(this.error);
      this.isLoading = false;
    });
    form.reset();
  }
  onHandleError(){
    this.error = "";
  }
  showErrorAlert(message:string){
    const alertcmpfactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
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
  }
}