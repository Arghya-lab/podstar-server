import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import User from "../models/user.model";
import Podcast from "../models/podcast.model";

export const getUserController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return ApiError(res, 404, "user not found please login.");
    }

    const user = await User.findById(req.user._id).populate({
      path: "subscriptions",
      select: "_id author imgUrl name feedUrl",
    });
    if (!user) return ApiError(res, 400, "Unauthorize access denied.");

    return res.status(200).json({
      success: true,
      message: "successfully got user data.",
      user: req.user,
      settings: user.settings,
    });
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

export const handleSubscribePodcast = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const expressUser = req.user;

    if (!expressUser) return ApiError(res, 400, "Unauthorize access denied.");

    let user = await User.findById(expressUser._id);
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
      select: "_id author imgUrl name feedUrl",
    });

    return res
      .status(200)
      .json({ success: true, subscriptions: user.subscriptions }); //add  message
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return ApiError(res, 404, "user not found please login.");
    }

    const user = await User.findById(req.user._id).populate({
      path: "subscriptions",
      select: "_id author imgUrl name feedUrl",
    });
    if (!user) return ApiError(res, 400, "Unauthorize access denied.");

    return res.status(200).json({
      success: true,
      message: "successfully got user subscription.",
      subscriptions: user.subscriptions,
    });
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};
