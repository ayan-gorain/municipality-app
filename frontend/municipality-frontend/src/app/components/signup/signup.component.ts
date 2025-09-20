import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormsModule } from "@angular/forms";
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import * as AuthActions from '../../../auth/store/auth.actions';
import * as AuthSelectors from '../../../auth/store/auth.selectors';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  role: string = 'customer';
  photoFile: File | null = null;
  photoPreview: string | ArrayBuffer | null = null;

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
        alert('Signup successful! Welcome! 🎉');
      }
    });

    // Listen for errors
    this.error$.subscribe(error => {
      if (error) {
        alert('Signup failed: ' + error);
      }
    });
  }

  // Capture file input
  uploadPhoto(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.photoFile = target.files[0];

      // Preview image
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = reader.result;
      reader.readAsDataURL(this.photoFile);
    }
  }

  // Signup method
  async onSignup() {
    if (!this.name || !this.email || !this.password || !this.role) {
      alert('All fields are required!');
      return;
    }

    let photoData = '';

    if (this.photoFile) {
      try {
        // Convert file to base64 for backend processing
        const reader = new FileReader();
        reader.onload = () => {
          photoData = reader.result as string;
          this.performSignup(photoData);
        };
        reader.readAsDataURL(this.photoFile);
      } catch (err) {
        alert('Photo processing failed. Please try again.');
        console.error(err);
        return;
      }
    } else {
      this.performSignup(photoData);
    }
  }

  private performSignup(photoData: string) {
    // Dispatch signup action to NgRx store
    this.store.dispatch(AuthActions.signupStart({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      photo: photoData
    }));
  }

  private clearForm() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.role = 'customer';
    this.photoFile = null;
    this.photoPreview = null;
  }
}
