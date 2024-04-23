const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema({
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

const Podcast = mongoose.model("Podcast", podcastSchema);

module.exports = Podcast;
