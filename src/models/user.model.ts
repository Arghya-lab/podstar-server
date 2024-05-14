import { Schema, model } from "mongoose";
import { IUser } from "../@types/models";

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    googleId: { type: String, default: null },
    image: { type: String, default: null },
    email: { type: String, unique: true, sparse: true }, // ensure that MongoDB indexes it as unique. The sparse option is set to true to allow multiple documents without an email field. This way, if the email field is present, MongoDB will enforce uniqueness for it, but it can still be absent for users where it's not applicable.
    hash: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String, default: null },
    verifyTokenExpiry: { type: Number, default: null },
    forgotPasswordToken: { type: String, default: null },
    forgotPasswordTokenExpiry: { type: Number, default: null },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);
export default User;
