const { default: podcastXmlParser } = require("podcast-xml-parser");
const ApiError = require("../utils/ApiError");
const Podcast = require("../models/podcast.model");
const removeTrailingSlash = require("../utils/removeTrailingSlash");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const searchPodcasts = async (req, res) => {
  try {
    const { query, page, perPage } = req.query;
    const regexQuery = new RegExp(escapeRegex(query), "gi");
    const resultSkip = (page - 1) * perPage;

    const result = await Podcast.find()
      .regex("name", regexQuery)
      .skip(resultSkip)
      .limit(perPage)
      .select(" _id name imgUrl author feedUrl");

    const totalResult = await Podcast.find()
      .regex("name", regexQuery)
      .countDocuments();

    return res
      .status(200)
      .json({ data: result, page, hasNextPage: totalResult > page * perPage });
  } catch (error) {
    return ApiError(res, 500, "Internal server error.", error);
  }
};

const getPodcastInfo = async (req, res) => {
  try {
    let { id, feedUrl } = req.query;
    // from id, feedUrl only one will be present
    if (id) {
      const podcast = await Podcast.findById(id);
      feedUrl = podcast.feedUrl;
    }
    const data = await podcastXmlParser(new URL(feedUrl), { itunes: true });

    return res.status(200).json(data);
  } catch (error) {
    return ApiError(res, 500, "Internal server error.", error);
  }
};

const addPodcastToDb = async (req, res) => {
  try {
    const { feedUrl } = req.body;
    const { podcast } = await podcastXmlParser(
      new URL(removeTrailingSlash(feedUrl))
    );

    const presentPodcast = await Podcast.findOne({
      name: podcast.title,
      feedUrl: podcast.feedUrl,
    }).select(" _id name imgUrl author feedUrl");
    if (presentPodcast) {
      return res.status(200).json(presentPodcast);
    }

    const newPodcast = await Podcast.create({
      name: podcast.title,
      author: podcast.itunesAuthor,
      feedUrl: podcast.feedUrl,
      imgUrl: podcast?.image.url || podcast.itunesImage,
    });

    return res
      .status(200)
      .json(
        await Podcast.findById(newPodcast._id).select(
          " _id name imgUrl author feedUrl"
        )
      );
  } catch (error) {
    return ApiError(res, 500, "Internal server error.", error);
  }
};

const getPodcastById = async (req, res) => {
  try {
    const id = req.params.id;
    const podcast = await Podcast.findById(id).select(
      " _id name imgUrl author feedUrl"
    );

    if (!podcast) {
      return ApiError(res, 400, "Podcast not found.");
    }

    return res.status(200).json(podcast);
  } catch (error) {
    return ApiError(res, 500, "Internal server error.", error);
  }
};

module.exports = {
  searchPodcasts,
  getPodcastInfo,
  addPodcastToDb,
  getPodcastById,
};
