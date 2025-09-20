import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormsModule } from "@angular/forms";
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import * as AuthActions from '../../../auth/store/auth.actions';
import * as AuthSelectors from '../../../auth/store/auth.selectors';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  // NgRx observables
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store) {
    this.isLoading$ = this.store.select(AuthSelectors.selectIsLoading);
    this.error$ = this.store.select(AuthSelectors.selectError);
    this.isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  }

  ngOnInit() {
    // Listen for authentication success
    this.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.clearForm();
        alert('Login successful! Welcome back! 🎉');
      }
    });

    // Listen for errors
    this.error$.subscribe(error => {
      if (error) {
        alert('Login failed: ' + error);
      }
    });
  }

  onLogin() {
    if (!this.email || !this.password) {
      alert('Please fill in all fields!');
      return;
    }

    // Dispatch login action to NgRx store
    this.store.dispatch(AuthActions.loginStart({
      email: this.email,
      password: this.password
    }));
  }

  private clearForm() {
    this.email = '';
    this.password = '';
  }
}