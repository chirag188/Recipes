import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError,tap} from "rxjs/operators";
import { User } from "./user.model";
import * as fromApp from "../app.reducer";
import { Login, LogOut } from "./auth.reducer";

export interface AuthResponseData{
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
}
@Injectable({providedIn:'root'})
export class AuthService{
    user = new BehaviorSubject<any>(null);
    private tokenExpirationTimer:any;
    constructor(private http:HttpClient,private router:Router,private store:Store<fromApp.AppState>){}
    signup(email:string,password:string){
        return this.http
        .post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA0Z3hzTempNBa-FgMpKuQiwbwrUgftgXA",{
            email:email,
            password:password,
            returnSecureToken:true
        })
        .pipe(catchError(this.handleError),tap(resData =>
            this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn)));
    }
    login(email:string,password:string){
        return this.http
        .post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA0Z3hzTempNBa-FgMpKuQiwbwrUgftgXA",{
            email:email,
            password:password,
            returnSecureToken:true
        })
        .pipe(catchError(this.handleError),tap(resData =>
            this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn)));
    }
    logout(){
        // this.user.next(null);
        this.store.dispatch(new LogOut());
        localStorage.removeItem("userData");
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }
    autoLogin(){
        const data = localStorage.getItem('userData');
        if(!data)
            return;
        const userData:{
            email:string;
            id:string;
            _token:string;
            _tokenExpirationDate:string;
        } = JSON.parse(data);
        const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));
        if(loadedUser.token){
            // this.user.next(loadedUser);
            Login.token = loadedUser.token;
            Login.userId = loadedUser.id;
            Login.email = loadedUser.email;
            Login.expirationDate = new Date(userData._tokenExpirationDate);
            this.store.dispatch(new Login());
            this.autoLogOut(new Date(userData._tokenExpirationDate).getTime()-new Date().getTime());
        }
    }
    autoLogOut(expiresDuration:number){
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        },expiresDuration);
        // const data = localStorage.getItem('userData');
        // if(!data)
        //     return;
        // const userData:{
        //     email:string;
        //     id:string;
        //     _token:string;
        //     _tokenExpirationDate:string;
        // } = JSON.parse(data);
        // const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));
        // if(loadedUser.token){
        //     this.user.next(loadedUser);
        // }
    }
    private handleAuthentication(email:string,userId:string,token:string,expiresIn:number){
        const expiresDate = new Date(new Date().getTime()+ +expiresIn*1000);
        const user = new User(email,userId,token,expiresDate);
        // this.user.next(user);
        Login.token = token;
        Login.userId = userId;
        Login.email = email;
        Login.expirationDate = expiresDate;
        this.store.dispatch(new Login());
        this.autoLogOut(expiresIn*1000);
        localStorage.setItem("userData",JSON.stringify(user));
        this.router.navigate(["/recipes"]);
    }
    private handleError(errorRes:HttpErrorResponse){
        let error = "Unknown Error";
            if(!errorRes.error || !errorRes.error.error){
                return throwError(error);
            }
            switch (errorRes.error.error.message) {
                case 'EMAIL_NOT_FOUND':
                    error = "Account not found.";
                    break;
                case 'INVALID_PASSWORD':
                    error = "Password is not valid";
                    break;
                case 'USER_DISABLED':
                    error = "Your account block for tempory!";
                    break;
                case 'EMAIL_EXISTS':
                    error = "Your Account alerady exist";
                    break;
                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                    error = "Too many attempt from this device please try again after some time!";
                    break;
                case 'OPERATION_NOT_ALLOWED':
                    error = "Requested Feature not available";
                    break;
            }
            return throwError(error);
    }
}