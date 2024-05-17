import { Document, ObjectId } from "mongoose";

export interface IFavoriteEpisode {
  PodcastId: ObjectId;
  guid: string;
}

export interface IUserSetting {
  playbackSpeed: number;
  rewindIntervalSec: number;
  forwardIntervalSec: number;
}

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
  subscriptions: ObjectId[];
  favorites: IFavoriteEpisode[];
  settings: IUserSetting;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITrending extends Document {
  podcastIds: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
