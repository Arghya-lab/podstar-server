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
import { getPodcastIdxTrending } from "../api";
import Trending from "../models/trending.model";
import ApiSuccess from "../utils/ApiSuccess";

function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

//*   ------------------------ Controller for search podcast from podcast index if some podcast not present in our db then add those and finally send podcast as per query from db  ------------------------ *//
export const searchPodcasts = async (
  req: SearchPodcastsRequest,
  res: Response
) => {
  try {
    const { query, page, perPage } = req.query;

    // const podcastIdxData = await searchPodcastIdxFeed(query);

    // const feeds =
    //   podcastIdxData?.feeds.filter(
    //     (item) =>
    //       item.type === 0 &&
    //       (Date.now() / 1000 - item.lastGoodHttpStatusTime) / (60 * 60 * 24) <
    //         30 &&
    //       /rss/i.test(item.contentType) &&
    //       item.locked !== 1
    //   ) || [];

    //  upload data to our db
    // const operations = feeds.map(async (feed) => {
    //   let podcast = await Podcast.findOne({
    //     feedUrl: { $in: [feed.url, feed.originalUrl] },
    //   }).select("-__v");

    //   if (!podcast) {
    //     podcast = await Podcast.create({
    //       name: feed.title,
    //       author: feed.author,
    //       feedUrl: removeTrailingSlash(feed.url),
    //       imgUrl: feed.image,
    //     });
    //   }
    //   return podcast;
    // });
    // await Promise.allSettled(operations);

    // actual search algo
    const regexQuery = new RegExp(escapeRegex(query), "gi");
    const resultSkip = (page - 1) * perPage;

    const result = await Podcast.find()
      .regex("name", regexQuery)
      .skip(resultSkip)
      .limit(perPage)
      .select("-__v");

    const totalResult = await Podcast.find()
      .regex("name", regexQuery)
      .countDocuments();

    return ApiSuccess(
      res,
      { result, page, hasNextPage: totalResult > page * perPage },
      "Successfully fetched search result."
    );
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller for fetch trending from podcast index and store in db and update every 24 hours ------------------------ *//
export const getTrendingPodcasts = async (req: Request, res: Response) => {
  try {
    let prevTrending = await Trending.findOne();
    if (!prevTrending) {
      prevTrending = await Trending.create({});
    }

    if (
      prevTrending.podcasts.length === 0 ||
      (Date.now() - prevTrending.updatedAt.getTime()) / (1000 * 60 * 60 * 12) >=
        1
    ) {
      const podcastIdxTrendingData = await getPodcastIdxTrending();

      if (podcastIdxTrendingData && podcastIdxTrendingData.status === "true") {
        const trendingIds: string[] = [];

        const trendingPodcastIdsPromise = podcastIdxTrendingData.feeds.map(
          async (feed) => {
            let podcast = await Podcast.findOne({
              feedUrl: removeTrailingSlash(feed.url),
            });
            if (!podcast) {
              podcast = await Podcast.create({
                name: feed.title,
                author: feed.author,
                feedUrl: removeTrailingSlash(feed.url),
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
            podcasts: trendingIds,
          });
        } else {
          await Trending.create({
            podcasts: trendingIds,
          });
        }
      }
    }

    const trendingDocument = await Trending.findOne().populate({
      path: "podcasts",
      select: "-__v",
    });

    return ApiSuccess(
      res,
      trendingDocument?.podcasts || [],
      "Successfully fetched trending."
    );
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller for fetch detail info from podcast rss feed  ------------------------ *//
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

    return ApiSuccess(
      res,
      {
        _id: podcast.id,
        ...data,
      },
      "Successfully fetch detail podcast data."
    );
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ If feed url present then add podcast send podcast fetch ed from db otherwise add to db and send to user  ------------------------ *//
export const addPodcastToDb = async (req: AddPodcastRequest, res: Response) => {
  try {
    const { feedUrl } = req.body;
    const { podcast } = await podcastXmlParser(
      new URL(removeTrailingSlash(feedUrl))
    );

    const presentPodcast = await Podcast.findOne({
      name: podcast.title,
      feedUrl: podcast.feedUrl,
    }).select("-__v");
    if (presentPodcast) {
      return ApiSuccess(res, presentPodcast);
    }

    const newPodcast = await Podcast.create({
      name: podcast.title,
      author: podcast.itunesAuthor,
      feedUrl: podcast.feedUrl,
      imgUrl: podcast.image?.url || podcast.itunesImage,
    });

    return ApiSuccess(
      res,
      await Podcast.findById(newPodcast._id).select("-__v")
    );
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller for return podcast which will be match by podcast id  ------------------------ *//
export const getPodcastById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const podcast = await Podcast.findById(id).select("-__v");

    if (!podcast) {
      return ApiError(res, 400, "Podcast not found.");
    }

    return ApiSuccess(res, podcast, "Successfully got podcast.");
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};
