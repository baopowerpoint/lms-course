import { models, model, Schema, Document } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  clerkId: string;
  email: string;
  bio?: string;
  picture?: string;
  location?: string;
}
export interface IUserDocument extends IUser, Document {}
const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    picture: { type: String },
    location: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = models?.User || model<IUser>("User", UserSchema);
export default User;
