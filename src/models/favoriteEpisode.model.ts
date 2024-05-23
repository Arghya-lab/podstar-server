import { Schema, model } from "mongoose";
import { IFavoriteEpisode } from "../@types/models";

const favoriteEpisodeSchema = new Schema<IFavoriteEpisode>({
  podcast: { type: Schema.Types.ObjectId, ref: "Podcast", required: true },
  episodeContent: {
    author: { type: String, default: "" },
    contentEncoded: { type: String, default: "" },
    description: { type: String, default: "" },
    enclosure: {
      url: {
        type: String,
        required: function () {
          return this.episodeContent.enclosure !== null;
        },
      },
      type: {
        type: String,
        required: function () {
          return this.episodeContent.enclosure !== null;
        },
      },
    },
    guid: { type: String, required: true, unique: true },
    itunesAuthor: { type: String, default: "" },
    itunesDuration: { type: Number, default: 0 },
    itunesEpisode: { type: String, default: "" },
    itunesEpisodeType: { type: String, default: "" },
    itunesExplicit: { type: String, default: "" },
    itunesSubtitle: { type: String, default: "" },
    itunesSummary: { type: String, default: "" },
    itunesTitle: { type: String, default: "" },
    link: { type: String, default: "" },
    pubDate: { type: String, default: "" },
    title: { type: String, default: "" },
  },
});

const FavoriteEpisode = model<IFavoriteEpisode>(
  "FavoriteEpisode",
  favoriteEpisodeSchema
);

export default FavoriteEpisode;
