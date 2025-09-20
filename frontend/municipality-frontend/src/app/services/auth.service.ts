import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  signup(
    name: string,
    email: string,
    password: string,
    role?: string,
    photo?: string
  ) {
    return this.apollo.mutate({
      mutation: gql`
        mutation Signup($input: SignupInput!) {
          signup(input: $input) {
            token
            user {
              id
              name
              email
              role
              photo
            }
          }
        }
      `,
      variables: { input: { name, email, password, role, photo } },
    } as any);
  }

  login(email: string, password: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            token
            user {
              id
              name
              email
              role
              photo
            }
          }
        }
      `,
      variables: { input: { email, password } },
    } as any);
  }
}
