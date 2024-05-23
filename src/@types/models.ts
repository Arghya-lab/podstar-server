import { Document, ObjectId } from "mongoose";
import { Episode } from "podcast-xml-parser";

export interface IUserSetting {
  playbackSpeed: number;
  rewindIntervalSec: number;
  forwardIntervalSec: number;
}

export interface IFavoriteEpisodeEnclosure {
  url: string;
  type: string;
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
  settings: IUserSetting;
  subscriptions: ObjectId[];
  favorites: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITrending extends Document {
  podcasts: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFavoriteEpisode extends Document {
  podcast: ObjectId;
  episodeContent: Episode;
}
