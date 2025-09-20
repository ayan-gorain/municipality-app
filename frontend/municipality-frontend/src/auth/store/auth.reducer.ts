import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const authReducer = createReducer(
  initialState,
  
  // Login Actions
  on(AuthActions.loginStart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isLoading: false,
    error: null,
    isAuthenticated: true,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isLoading: false,
    error,
    isAuthenticated: false,
  })),

  // Signup Actions
  on(AuthActions.signupStart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.signupSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isLoading: false,
    error: null,
    isAuthenticated: true,
  })),
  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isLoading: false,
    error,
    isAuthenticated: false,
  })),

  // Logout Actions
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  }))
);
