const { default: podcastXmlParser } = require("podcast-xml-parser");
const ApiError = require("../utils/ApiError");
const Podcast = require("../models/podcast.model");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const addPodcastToDb = async (req, res) => {
  try {
    const { feedUrl } = req.body;

    const { podcast } = await podcastXmlParser(new URL(feedUrl));

    const isPodcastPresent = await Podcast.findOne({ name: podcast.title, feedUrl });
    if (isPodcastPresent) {
      ApiError(res, 400, "feedUrl is already present.");
      return;
    }

    const newPodcast = await Podcast.create({
      name: podcast.title,
      author: podcast.itunesAuthor,
      feedUrl: podcast.feedUrl,
      imgUrl: podcast?.image.url || podcast.itunesImage,
    });

    return res.status(200).json({ data: newPodcast });
  } catch (error) {
    return ApiError(res, 500, "Internal server error.", error);
  }
};

module.exports = { addPodcastToDb };
