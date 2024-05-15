import { Document } from "mongoose";

export interface IPodcast extends Document {
  name: string;
  author: string;
  feedUrl: string;
  imgUrl: string;
}

export interface IUser extends Document {
  userName: string;
  googleId: string | null;
  image: string | null;
  email: string | null;
  hash: string | null;
  isVerified: boolean;
  verifyToken: string | null;
  verifyTokenExpiry: number | null;
  forgotPasswordToken: string | null;
  forgotPasswordTokenExpiry: number | null;
}
