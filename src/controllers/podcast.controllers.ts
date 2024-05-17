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
import User from "../models/user.model";
import { getPodcastIdxTrending, searchPodcastIdxFeed } from "../api";
import Trending from "../models/trending.model";
import iso8601ToSeconds from "../utils/iso8601ToSeconds";

function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export const searchPodcasts = async (
  req: SearchPodcastsRequest,
  res: Response
) => {
  try {
    const { query, page, perPage } = req.query;

    const podcastIdxData = await searchPodcastIdxFeed(query);

    const feeds =
      podcastIdxData?.feeds.filter(
        (item) =>
          item.type === 0 &&
          (Date.now() / 1000 - item.lastGoodHttpStatusTime) / (60 * 60 * 24) <
            30 &&
          /rss/i.test(item.contentType) &&
          item.locked !== 1
      ) || [];

    //  upload data to our db
    const operations = feeds.map(async (feed) => {
      let podcast = await Podcast.findOne({
        feedUrl: { $in: [feed.url, feed.originalUrl] },
      }).select(" _id name imgUrl author feedUrl");
      if (!podcast) {
        podcast = await Podcast.create({
          name: feed.title,
          author: feed.author,
          feedUrl: feed.url,
          imgUrl: feed.image,
        });
      }
      return podcast;
    });
    await Promise.allSettled(operations);

    // actual search algo
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
      .json({ data: result, page, hasNextPage: totalResult > page * perPage }); //add success, message
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

export const getTrendingPodcasts = async (req: Request, res: Response) => {
  try {
    const podcastIdxTrendingData = await getPodcastIdxTrending();
    let prevTrending = await Trending.findOne();
    if (!prevTrending) {
      prevTrending = await Trending.create({});
    }

    if (
      podcastIdxTrendingData &&
      podcastIdxTrendingData.status === "true" &&
      (((Date.now() / 1000 - podcastIdxTrendingData.since) / (60 * 60 * 24) <=
        1 &&
        (iso8601ToSeconds(String(prevTrending.updatedAt)) -
          podcastIdxTrendingData.since) /
          (60 * 60 * 24) >=
          1) ||
        prevTrending.podcastIds.length === 0)
    ) {
      const trendingIds: string[] = [];

      const trendingPodcastIdsPromise = podcastIdxTrendingData.feeds.map(
        async (feed) => {
          let podcast = await Podcast.findOne({
            feedUrl: feed.url,
          });
          if (!podcast) {
            podcast = await Podcast.create({
              name: feed.title,
              author: feed.author,
              feedUrl: feed.url,
              imgUrl: feed.image,
            });
          }
          return podcast._id;
        }
      );
      await Promise.allSettled(trendingPodcastIdsPromise).then((results) => {
        results.forEach((result) => {
          if (result.status === "fulfilled") trendingIds.push(result.value);
        });
      });

      if (prevTrending) {
        await Trending.findByIdAndUpdate(prevTrending._id, {
          podcastIds: trendingIds,
        });
      } else {
        await Trending.create({
          podcastIds: trendingIds,
        });
      }
    }

    const trendingDocument = await Trending.findOne().populate({
      path: "podcastIds",
      select: "_id author imgUrl name feedUrl",
    });
    return res.status(200).json(trendingDocument?.podcastIds || []); //add success, message
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

export const getPodcastInfo = async (
  req: GetPodcastsInfoRequest,
  res: Response
) => {
  try {
    const { id } = req.query;

    const podcast = await Podcast.findById(id);
    if (!podcast) return ApiError(res, 404, "Podcast not found.");

    const data = await podcastXmlParser(new URL(podcast.feedUrl), {
      itunes: true,
    });
    return res.status(200).json({ _id: podcast.id, ...data }); //add success, message
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

    return res //add success, message
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

    return res.status(200).json(podcast); //add success, message
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};
