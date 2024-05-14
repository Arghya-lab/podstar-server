import { Request, Response } from "express";
import podcastXmlParser from "podcast-xml-parser";
import ApiError from "../utils/ApiError";
import Podcast from "../models/podcast.model";
import removeTrailingSlash from "../utils/removeTrailingSlash";
import {
  AddPodcastRequest,
  GetPodcastsInfoRequest,
  SearchPodcastsRequest,
} from "../@types/request";

function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export const searchPodcasts = async (
  req: SearchPodcastsRequest,
  res: Response
) => {
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
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

export const getPodcastInfo = async (
  req: GetPodcastsInfoRequest,
  res: Response
) => {
  try {
    let { id, feedUrl } = req.query;
    // from id, feedUrl only one will be present
    if (id) {
      const podcast = await Podcast.findById(id);
      if (!podcast) return ApiError(res, 404, "Podcast not found.");

      feedUrl = podcast.feedUrl;
    }
    if (feedUrl) {
      const data = await podcastXmlParser(new URL(feedUrl), { itunes: true });
      return res.status(200).json(data);
    }

    return ApiError(res, 400, "No relevant query present.");
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

export const addPodcastToDb = async (req: AddPodcastRequest, res: Response) => {
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
      imgUrl: podcast.image?.url || podcast.itunesImage,
    });

    return res
      .status(200)
      .json(
        await Podcast.findById(newPodcast._id).select(
          " _id name imgUrl author feedUrl"
        )
      );
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

export const getPodcastById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const podcast = await Podcast.findById(id).select(
      " _id name imgUrl author feedUrl"
    );

    if (!podcast) {
      return ApiError(res, 400, "Podcast not found.");
    }

    return res.status(200).json(podcast);
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};
