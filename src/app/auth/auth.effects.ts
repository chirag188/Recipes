import { HttpClient } from "@angular/common/http";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import * as AuthActions from "./auth.reducer";
import { AuthResponseData, AuthService } from "./auth.service";
import { environment} from "../../environments/environment";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "./user.model";

@Injectable()
export class  AuthEffects {
    @Effect()
    authSignup = this.action$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((authData:AuthActions.SignupStart) => {
            return this.http
            .post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="+environment.firebaseAPIKey,{
            email:AuthActions.SignupStart.email,
            password:AuthActions.SignupStart.password,
            returnSecureToken:true
        }).pipe(tap(resData => {
                this.authService.setLogOutTimer(+resData.expiresIn*1000);    
            })
            ,map(resData => {
            return this.authHandler(resData);
        }))
        }),catchError(errorRes => {
            AuthActions.AuthenticateFail.error = this.errorHandler(errorRes);
            return of(new AuthActions.AuthenticateFail());
        }),
    );

    @Effect()
    authLogin = this.action$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData:AuthActions.LoginStart) => {
            return this.http
            .post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+environment.firebaseAPIKey,{
            email:AuthActions.LoginStart.email,
            password:AuthActions.LoginStart.password,
            returnSecureToken:true
        }).pipe(tap(resData => {
            this.authService.setLogOutTimer(+resData.expiresIn*1000);    
        }),map(resData => {
            return this.authHandler(resData);
        }))
        }),catchError(errorRes => {
            AuthActions.AuthenticateFail.error = this.errorHandler(errorRes);
            return of(new AuthActions.AuthenticateFail());
        }),
    );
    authHandler(resData:any){
        AuthActions.AuthenticateSuccess.email = resData.email;
        AuthActions.AuthenticateSuccess.token = resData.idToken;
        AuthActions.AuthenticateSuccess.userId = resData.localId;
        AuthActions.AuthenticateSuccess.expirationDate = new Date(new Date().getTime() + +resData.expiresIn*1000);
        const user = new User(resData.email,resData.localId,resData.idToken,AuthActions.AuthenticateSuccess.expirationDate);
        localStorage.setItem("userData",JSON.stringify(user));
        return new AuthActions.AuthenticateSuccess();
    }
    errorHandler(errorRes:any):string{
        let error = "Unknown Error";
            if(!errorRes.error || !errorRes.error.error){
                return error;
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
        return error;
    }
    @Effect({dispatch:false})
    authRedirect = this.action$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
        if(AuthActions.AuthenticateSuccess.redirect)
            this.router.navigate(["/"]);
        AuthActions.AuthenticateSuccess.redirect = false;
    }));
    @Effect({dispatch:false})
    authLogout = this.action$.pipe(ofType(AuthActions.LOGOUT),tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(["/auth"]);
    }));
    @Effect()
    autoLogin = this.action$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const data = localStorage.getItem('userData');
            if(!data)
               return {type:'Dummy'};
            const userData:{
                email:string;
                id: string;
                _token:string;
                _tokenExpirationDate:string;
            } = JSON.parse(data);
            const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));
            if(loadedUser.token){
                AuthActions.AuthenticateSuccess.token = loadedUser.token;
                AuthActions.AuthenticateSuccess.userId = loadedUser.id;
                AuthActions.AuthenticateSuccess.email = loadedUser.email;
                AuthActions.AuthenticateSuccess.redirect = false;
                AuthActions.AuthenticateSuccess.expirationDate = new Date(userData._tokenExpirationDate);
                return new AuthActions.AuthenticateSuccess();
                // this.store.dispatch(new AuthenticateSuccess());
                // this.autoLogOut(new Date(userData._tokenExpirationDate).getTime()-new Date().getTime());
            }
            return {type:'Dummy'};
        })
    )
    constructor(private action$:Actions,private http:HttpClient,private router:Router,private authService:AuthService){}
}