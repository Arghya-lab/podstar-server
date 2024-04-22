const { body } = require("express-validator");

const addPodcastValidate = () =>
  body("feedUrl")
    .trim()
    .notEmpty()
    .withMessage("feedUrl is required.")
    .isString()
    .withMessage("feedUrl have to be string.")
    .isURL()
    .withMessage("feedUrl is not a url.")

module.exports = { addPodcastValidate };
