import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import User from "../models/user.model";
import Podcast from "../models/podcast.model";
import ApiSuccess from "../utils/ApiSuccess";
import FavoriteEpisode from "../models/favoriteEpisode.model";

//*   ------------------------ Controller for get login user data  ------------------------ *//
export const getUserController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return ApiError(res, 404, "user not found please login.");
    }

    const user = await User.findById(req.user._id);
    if (!user) return ApiError(res, 400, "Unauthorize access denied.");

    return ApiSuccess(
      res,
      { user: req.user, settings: user.settings },
      "successfully got user data."
    );
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller for update playback speed  ------------------------ *//
export const updatePlaybackSpeed = async (req: Request, res: Response) => {
  try {
    const { playbackSpeed } = req.body;
    if (!req.user) {
      return ApiError(res, 404, "user not found please login.");
    }

    let user = await User.findById(req.user._id);
    if (!user) return ApiError(res, 400, "Unauthorize access denied.");

    user = await User.findByIdAndUpdate(
      req.user._id,
      {
        settings: { ...user.settings, playbackSpeed: Number(playbackSpeed) },
      },
      {
        new: true,
      }
    );
    if (!user)
      return ApiError(res, 400, "Error occur while updating playback Speed.");

    return ApiSuccess(
      res,
      user.settings,
      "successfully updated playback speed."
    );
  } catch (error) {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller for update rewind interval  ------------------------ *//
export const updateRewindInterval = async (req: Request, res: Response) => {
  try {
    const { rewindInterval } = req.body;
    if (!req.user) {
      return ApiError(res, 404, "user not found please login.");
    }

    let user = await User.findById(req.user._id);
    if (!user) return ApiError(res, 400, "Unauthorize access denied.");

    user = await User.findByIdAndUpdate(
      req.user._id,
      {
        settings: {
          ...user.settings,
          rewindIntervalSec: Number(rewindInterval),
        },
      },
      {
        new: true,
      }
    );
    if (!user)
      return ApiError(res, 400, "Error occur while updating rewind interval.");

    return ApiSuccess(
      res,
      user.settings,
      "successfully updated rewind interval."
    );
  } catch (error) {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller for update forward interval  ------------------------ *//
export const updateForwardInterval = async (req: Request, res: Response) => {
  try {
    const { forwardInterval } = req.body;
    if (!req.user) {
      return ApiError(res, 404, "user not found please login.");
    }

    let user = await User.findById(req.user._id);
    if (!user) return ApiError(res, 400, "Unauthorize access denied.");

    user = await User.findByIdAndUpdate(
      req.user._id,
      {
        settings: {
          ...user.settings,
          forwardIntervalSec: Number(forwardInterval),
        },
      },
      {
        new: true,
      }
    );
    if (!user)
      return ApiError(res, 400, "Error occur while updating forward interval.");

    return ApiSuccess(
      res,
      user.settings,
      "successfully updated forward interval."
    );
  } catch (error) {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller for subscribe unsubscribe podcast  ------------------------ *//
export const handleSubscribePodcast = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!req.user) return ApiError(res, 400, "Unauthorize access denied.");

    let user = await User.findById(req.user._id);
    if (!user || !user.isVerified) {
      return ApiError(res, 400, "Unauthorize access denied.");
    }
    const podcast = await Podcast.findById(id);
    if (!podcast) {
      return ApiError(res, 400, "Podcast not found.");
    }

    const isSubscribed = user.subscriptions.includes(podcast._id);
    if (isSubscribed) {
      user.subscriptions = user.subscriptions.filter(
        (sub) => sub.toString() != podcast._id.toString()
      );
    } else {
      user.subscriptions.unshift(podcast._id);
    }
    await user.save();

    user = await user.populate({
      path: "subscriptions",
      select: "-__v",
    });

    return ApiSuccess(
      res,
      user.subscriptions,
      "successfully updated subscriptions."
    );
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller for get user subscribed podcasts  ------------------------ *//
export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return ApiError(res, 404, "user not found please login.");
    }

    const user = await User.findById(req.user._id).populate({
      path: "subscriptions",
      select: "-__v",
    });
    if (!user) return ApiError(res, 400, "Unauthorize access denied.");

    return ApiSuccess(
      res,
      user.subscriptions,
      "successfully got user subscription."
    );
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller for subscribe unsubscribe podcast  ------------------------ *//
export const handleFavoritePodcastEp = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return ApiError(res, 404, "user not found please login.");
    }

    let user = await User.findById(req.user._id);
    if (!user || !user.isVerified) {
      return ApiError(res, 400, "Unauthorize access denied.");
    }

    const {
      podcastId,
      title,
      description,
      enclosure,
      guid,
      duration,
      pubDate,
    } = req.body;

    let favoriteEpisode = await FavoriteEpisode.findOne({ guid });
    if (!favoriteEpisode) {
      favoriteEpisode = await FavoriteEpisode.create({
        podcast: podcastId,
        title,
        description,
        enclosure,
        guid,
        duration,
        pubDate,
      });
    }

    const isFavorite = user.favorites.includes(favoriteEpisode._id);
    if (isFavorite) {
      user.favorites = user.favorites.filter(
        (fav) => fav.toString() != favoriteEpisode._id.toString()
      );
    } else {
      user.favorites.unshift(favoriteEpisode._id);
    }
    await user.save();

    user = await user.populate({
      path: "favorites",
      select: "-__v",
      populate: {
        path: "podcast",
        select: "-__v",
      },
    });

    return ApiSuccess(res, user.favorites, "successfully updated favorites.");
  } catch (error) {
    console.log(error);

    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller for get user favorites podcast episodes  ------------------------ *//
export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return ApiError(res, 404, "user not found please login.");
    }

    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      select: "-__v",
      populate: {
        path: "podcast",
        select: "-__v",
      },
    });
    if (!user) return ApiError(res, 400, "Unauthorize access denied.");

    return ApiSuccess(res, user.favorites, "successfully got user favorites.");
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};
