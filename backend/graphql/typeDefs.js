export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    photoUrl: String
  }

  type AuthPayload {
    token: String!
    role: String!
    name: String!
    photoUrl: String
  }

  type Query {
    users: [User!]
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!, role: String, photo: String): String!
    login(email: String!, password: String!): AuthPayload!
  }
`;
