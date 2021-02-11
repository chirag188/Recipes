import { Action } from "@ngrx/store";
import { User } from "./user.model";

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export interface State{
    user: User
}
export class Login implements Action {
    type = LOGIN;
    static email:string;
    static userId:string;
    static token:string;
    static expirationDate:Date;
}
export class LogOut implements Action {
    type = LOGOUT;
}
export type AuthAction = 
    | Login
    | LogOut;

const initialState:State = {
    user: null as any
};
export function authReducer(state = initialState,action:AuthAction){
    console.log(state);
    switch(action.type){
        case LOGIN:
            const user = new User(Login.email,Login.userId,Login.token,Login.expirationDate);
            return {
                ...state,
                user: user
            }
        case LOGOUT:
            return {
                ...state,
                user:null as any
            }
        default:
            return state;
    }
}