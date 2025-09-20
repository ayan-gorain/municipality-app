import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideApollo } from 'apollo-angular';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from '../auth/store/auth.reducer';
import { AuthEffects } from '../auth/store/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      return new ApolloClient({
        link: new HttpLink({ uri: environment.graphqlUri }),
        cache: new InMemoryCache(),
      });
    }),
    provideStore({ auth: authReducer }),
    provideEffects([AuthEffects]),
  ],
};
