import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = new ApolloServer({
  typeDefs: `#graphql
    type Query {
      hello: String
    }
  `,
  resolvers: {
    Query: {
      hello: () => "Hello Municipality 🚀",
    },
  },
});

await server.start();
app.use("/graphql", expressMiddleware(server));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}/graphql`)
    );
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));
