import { Schema, model } from "mongoose";
import { IFavoriteEpisode, IUser } from "../@types/models";

const userFavoriteEpisodeSchema = new Schema<IFavoriteEpisode>({
  PodcastId: Schema.Types.ObjectId,
  guid: String,
});

const userSchema = new Schema<IUser>(
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
    subscriptions: {
      type: [Schema.Types.ObjectId],
      ref: "Podcast",
      default: [],
    },
    favorites: {
      type: [userFavoriteEpisodeSchema],
      default: [],
    },
    settings: {
      playbackSpeed: { type: Number, default: 1, min: 0.5, max: 4.0 },
      rewindIntervalSec: { type: Number, default: 10, min: 5, max: 90 },
      forwardIntervalSec: { type: Number, default: 10, min: 5, max: 90 },
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);
export default User;
