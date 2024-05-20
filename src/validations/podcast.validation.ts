import { body, query, param } from "express-validator";
import mongoose from "mongoose";

export const searchPodcastValidate = () => [
  query("query")
    .trim()
    .notEmpty()
    .withMessage("query value required in searchParam.")
    .isString()
    .withMessage("query have to be string.")
    .isLength({ min: 3, max: 20 })
    .withMessage("query length should be between 3 to 20."),
  query("page")
    .trim()
    .default(1)
    .isNumeric()
    .withMessage("page have to be number.")
    .customSanitizer((value) => {
      if (value < 1) return 1;

      return value;
    })
    .toInt(),
  query("perPage")
    .trim()
    .default(20)
    .isNumeric()
    .withMessage("perPage have to be number.")
    .customSanitizer((value) => {
      if (value > 30) {
        return 30;
      } else if (value < 15) {
        return 15;
      }
      return value;
    })
    .toInt(),
];

export const podcastInfoValidate = () => [
  query("id")
    .optional()
    .trim()
    .isString()
    .withMessage("id have to be string.")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("id param is not valid."),
];

export const addPodcastValidate = () =>
  body("feedUrl")
    .trim()
    .optional()
    .notEmpty()
    .withMessage("feedUrl is required.")
    .isString()
    .withMessage("feedUrl have to be string.")
    .isURL()
    .withMessage("feedUrl is not an url.");

export const podcastByIdValidate = () => [
  param("id")
    .trim()
    .isString()
    .withMessage("id have to be string.")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("id param is not valid."),
];
