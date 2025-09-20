import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";

export const resolvers = {
  Query: {
    users: async () => await User.find(),
  },
  Mutation: {
    signup: async (_, { input }) => {
      const { name, email, password, role, photo } = input;
      const hashed = await bcrypt.hash(password, 10);

      let photoUrl = "";
      if (photo) {
        const uploaded = await cloudinary.v2.uploader.upload(photo, { folder: "users" });
        photoUrl = uploaded.secure_url;
      }

      const user = new User({ name, email, password: hashed, role, photo: photoUrl });
      await user.save();

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return { 
        token, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photo: user.photo
        }
      };
    },
    login: async (_, { input }) => {
      const { email, password } = input;
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return { 
        token, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photo: user.photo
        }
      };
    },
  },
};
