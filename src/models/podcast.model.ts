import { Schema, model } from "mongoose";
import { IPodcast } from "../@types/models";

const podcastSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: "",
  },
  feedUrl: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    default: "",
  },
});

const Podcast = model<IPodcast>("Podcast", podcastSchema);

export default Podcast;
