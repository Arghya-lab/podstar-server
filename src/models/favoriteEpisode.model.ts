import { Schema, model } from "mongoose";
import { IFavoriteEpisode } from "../@types/models";

const favoriteEpisodeSchema = new Schema<IFavoriteEpisode>({
  podcast: { type: Schema.Types.ObjectId, ref: "Podcast", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  enclosure: {
    url: { type: String, required: true },
    type: { type: String, required: true },
  },
  guid: { type: String, required: true, unique: true },
  duration: { type: Number, required: true },
  pubDate: { type: String, required: true },
});

const FavoriteEpisode = model<IFavoriteEpisode>(
  "FavoriteEpisode",
  favoriteEpisodeSchema
);

export default FavoriteEpisode;
