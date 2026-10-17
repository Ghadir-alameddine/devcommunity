
import mongoose, { Schema } from "mongoose";

interface IUser {
  name: string;
  email: string;
  username: string;
  image?: string;
  bio?: string;
  location?: string;
  skills: string[];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String },
    bio: { type: String },
    location: { type: String },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;