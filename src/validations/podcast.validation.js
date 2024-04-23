const { body, query } = require("express-validator");

const searchPodcastValidate = () => [
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

const podcastInfoValidate = () => [
  query("feedUrl")
    .custom((_, { req }) => {
      if (!!req.query.id && !!req.query.feedUrl) {
        // If both searchParam present
        return false;
      }
      return true;
    })
    .withMessage("feedUrl query & id query both should not present.")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("feedUrl is required.")
    .isString()
    .withMessage("feedUrl have to be string.")
    .isURL()
    .withMessage("feedUrl is not an url."),
  query("id")
    .custom((_, { req }) => {
      if (!req.query.id && !req.query.feedUrl) {
        // If no relevant searchParam present
        return false;
      }
      return true;
    })
    .withMessage("No relevant query present.")
    .optional()
    .trim()
    .isString()
    .withMessage("id have to be string."),
];

const addPodcastValidate = () =>
  body("feedUrl")
    .trim()
    .optional()
    .notEmpty()
    .withMessage("feedUrl is required.")
    .isString()
    .withMessage("feedUrl have to be string.")
    .isURL()
    .withMessage("feedUrl is not an url.");

module.exports = {
  searchPodcastValidate,
  podcastInfoValidate,
  addPodcastValidate,
};
