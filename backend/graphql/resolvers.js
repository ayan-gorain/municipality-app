import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";

export const resolvers = {
  Query: {
    users: async () => await User.find(),
  },
  Mutation: {
    signup: async (_, { name, email, password, role, photo }) => {
      const hashed = await bcrypt.hash(password, 10);

      let photoUrl = "";
      if (photo) {
        const uploaded = await cloudinary.v2.uploader.upload(photo, { folder: "users" });
        photoUrl = uploaded.secure_url;
      }

      const user = new User({ name, email, password: hashed, role, photoUrl });
      await user.save();

      return "User created!";
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return { token, role: user.role, name: user.name, photoUrl: user.photoUrl };
    },
  },
};
