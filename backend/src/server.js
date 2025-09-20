import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "../routes/auth.routes.js";
import { typeDefs } from "../graphql/typeDefs.js";
import { resolvers } from "../graphql/resolvers.js";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes);


const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
app.use("/graphql", expressMiddleware(server));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running: http://localhost:${process.env.PORT}/graphql`)
    );
  })
  .catch((err) => console.error("MongoDB Error:", err));
