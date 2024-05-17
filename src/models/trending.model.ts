import { model, Schema } from "mongoose";
import { ITrending } from "../@types/models";

const trendingSchema = new Schema<ITrending>(
  {
    podcastIds: { type: [Schema.Types.ObjectId], ref: "Podcast", default: [] },
  },
  { timestamps: true }
);

const Trending = model<ITrending>("Trending", trendingSchema);

export default Trending;
