import { createAction, props } from "@ngrx/store";
import { User } from "../../models/user.model";

export const loginStart = createAction("[Auth] Login Start", props<{ email: string; password: string }>());
export const loginSuccess = createAction("[Auth] Login Success", props<{ user: User; token: string }>());
export const loginFailure = createAction("[Auth] Login Failure", props<{ error: string }>());

export const signupStart = createAction(
  "[Auth] Signup Start",
  props<{ name: string; email: string; password: string; role?: string; photo?: string }>()
);
export const signupSuccess = createAction("[Auth] Signup Success", props<{ user: User; token: string }>());
export const signupFailure = createAction("[Auth] Signup Failure", props<{ error: string }>());

// Logout Actions
export const logout = createAction("[Auth] Logout");
export const logoutSuccess = createAction("[Auth] Logout Success");
