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
  body("episode.author")
    .isString()
    .withMessage("podcast episode author not found."),
  body("episode.contentEncoded")
    .isString()
    .withMessage("podcast episode contentEncoded not found."),
  body("episode.description")
    .isString()
    .withMessage("podcast episode description not found."),
  body("episode.enclosure")
    .custom((value) => {
      if (value === null) return true;
      if (typeof value !== "object" || !value.url || !value.type) {
        return false;
      }
      return true;
    })
    .withMessage("podcast wrong episode enclosure found."),
  body("episode.enclosure.url")
    .optional({ nullable: true })
    .isString()
    .withMessage("podcast episode enclosure url not found."),
  body("episode.enclosure.type")
    .optional({ nullable: true })
    .isString()
    .withMessage("podcast episode enclosure type not found."),
  body("episode.guid")
    .isString()
    .withMessage("podcast episode guid not found."),
  body("episode.itunesAuthor")
    .isString()
    .withMessage("podcast episode itunesAuthor not found."),
  body("episode.itunesDuration")
    .isInt({ min: 0 })
    .withMessage("podcast incorrect episode itunesDuration."),
  body("episode.itunesEpisode")
    .isString()
    .withMessage("podcast episode itunesEpisode not found."),
  body("episode.itunesEpisodeType")
    .isString()
    .withMessage("podcast episode itunesEpisodeType not found."),
  body("episode.itunesExplicit")
    .isString()
    .withMessage("podcast episode itunesExplicit not found."),
  body("episode.itunesSubtitle")
    .isString()
    .withMessage("podcast episode itunesSubtitle not found."),
  body("episode.itunesSummary")
    .isString()
    .withMessage("podcast episode itunesSummary not found."),
  body("episode.itunesTitle")
    .isString()
    .withMessage("podcast episode itunesTitle not found."),
  body("episode.link")
    .isString()
    .withMessage("podcast episode link not found."),
  body("episode.pubDate")
    .isString()
    .withMessage("podcast episode pubDate not found."),
  body("episode.title")
    .isString()
    .withMessage("podcast episode title not found."),
];
