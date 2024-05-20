import { body } from "express-validator";
import mongoose from "mongoose";
import Podcast from "../models/podcast.model";

export const validatePlaybackSpeed = () => [
  body("playbackSpeed")
    .trim()
    .notEmpty()
    .withMessage("playbackSpeed is required.")
    .isNumeric()
    .withMessage("playbackSpeed have to be number.")
    .isFloat({ min: 0.5, max: 4 })
    .withMessage("playbackSpeed must be between 0.5 and 4 inclusive"),
];

export const validateRewindInterval = () => [
  body("rewindInterval")
    .trim()
    .notEmpty()
    .withMessage("rewindInterval is required.")
    .isNumeric()
    .withMessage("rewindInterval have to be number.")
    .isFloat({ min: 5, max: 90 })
    .withMessage("rewindInterval must be between 5 and 90 inclusive"),
];

export const validateForwardInterval = () => [
  body("forwardInterval")
    .trim()
    .notEmpty()
    .withMessage("forwardInterval is required.")
    .isNumeric()
    .withMessage("forwardInterval have to be number.")
    .isFloat({ min: 5, max: 90 })
    .withMessage("forwardInterval must be between 5 and 90 inclusive"),
];

export const toggleFavoriteValidate = () => [
  body("podcastId")
    .trim()
    .notEmpty()
    .withMessage("podcastId is required.")
    .isString()
    .withMessage("podcastId have to be string.")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("id param is not valid.")
    .custom(async (value) => {
      const podcast = await Podcast.findById(value);
      return !!podcast;
    })
    .withMessage("podcast not found with the podcastId."),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("title required.")
    .isString()
    .withMessage("title have to be string."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("description required.")
    .isString()
    .withMessage("description have to be string."),
  body("enclosure")
    .isObject()
    .custom((value) => !!value?.url)
    .withMessage("url property in enclosure is not provided.")
    .custom((value) => typeof value?.url === "string")
    .withMessage("url property in enclosure have to be string.")
    .custom((value) => !!value?.type)
    .withMessage("type property in enclosure is not provided.")
    .custom((value) => typeof value?.type === "string")
    .withMessage("type property in enclosure have to be string."),
  body("guid")
    .trim()
    .notEmpty()
    .withMessage("guid required.")
    .isString()
    .withMessage("guid have to be string."),
  body("duration")
    .trim()
    .notEmpty()
    .withMessage("duration is required.")
    .isNumeric()
    .withMessage("duration have to be number."),
  body("pubDate")
    .trim()
    .notEmpty()
    .withMessage("pubDate required.")
    .isString()
    .withMessage("pubDate have to be string."),
];
