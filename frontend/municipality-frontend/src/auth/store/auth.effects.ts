import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../app/services/auth.service';
import * as AuthActions from './auth.actions';
import { AuthState } from './auth.reducer';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private store = inject(Store<{ auth: AuthState }>);

  // Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response: any) => {
            const user = response.data.login.user;
            const token = response.data.login.token;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return AuthActions.loginSuccess({ user, token });
          }),
          catchError((error) => {
            const errorMessage = error.message || 'Login failed';
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Signup Effect
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap(({ name, email, password, role, photo }) =>
        this.authService.signup(name, email, password, role, photo).pipe(
          map((response: any) => {
            const user = response.data.signup.user;
            const token = response.data.signup.token;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return AuthActions.signupSuccess({ user, token });
          }),
          catchError((error) => {
            const errorMessage = error.message || 'Signup failed';
            return of(AuthActions.signupFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Logout Effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );
}
