import { Action } from "@ngrx/store";
import { User } from "./user.model";

export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const LOGIN_START = '[Auth] Login Start';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] Signup Start';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export interface State{
    user: User;
    authError:string;
    loading:boolean;
}
export class AuthenticateSuccess implements Action {
    type = AUTHENTICATE_SUCCESS;
    static email:string;
    static userId:string;
    static token:string;
    static expirationDate:Date;
    static redirect:boolean;
}
export class LogOut implements Action {
    type = LOGOUT;
}
export class LoginStart implements Action {
    type = LOGIN_START;
    static email:string;
    static password:string;
}
export class SignupStart implements Action {
    type = SIGNUP_START;
    static email:string;
    static password:string;
}
export class AuthenticateFail implements Action {
    type = AUTHENTICATE_FAIL;
    static error:string;
}
export class  ClearError implements Action{
    type = CLEAR_ERROR;
}
export class  AutoLogin implements Action{
    type = AUTO_LOGIN;
}
export type AuthAction = 
    | AuthenticateFail
    | AuthenticateSuccess
    | LogOut
    | LoginStart
    | SignupStart
    | ClearError
    | AutoLogin;

const initialState:State = {
    user: null as any,
    authError:null as any,
    loading:false
};
export function authReducer(state = initialState,action:AuthAction){
    switch(action.type){
        case AUTHENTICATE_SUCCESS:
            const user = new User(AuthenticateSuccess.email,
                AuthenticateSuccess.userId,
                AuthenticateSuccess.token,
                AuthenticateSuccess.expirationDate);
            return {
                ...state,
                authError:null as any,
                user: user,
                loading:false
            }
        case LOGOUT:
            return {
                ...state,
                user:null as any
            }
        case LOGIN_START:
            return{
                ...state,
                authError: null as any,
                loading:true
            }
        case AUTHENTICATE_FAIL:
            return{
                ...state,
                user: null as any,
                authError:AuthenticateFail.error,
                loading:false
            }
        case SIGNUP_START:
            return{
                ...state,
                authError: null as any,
                loading:true
            }
        case CLEAR_ERROR:
            return{
                ... state,
                authError:null as any
            }
        default:
            return state;
    }
}