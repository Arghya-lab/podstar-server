const { Router } = require("express");
const {
  addPodcastValidate,
  searchPodcastValidate,
  podcastInfoValidate,
} = require("../validations/podcast.validation");
const {
  addPodcastToDb,
  searchPodcasts,
  getPodcastInfo,
} = require("../controllers/podcast.controller");
const validate = require("../validations/validate");

const router = Router();

/**
 * Route: GET /podcast
 * Description: Search podcasts
 * Request Query:
 *   - query (required): Query to search podcasts
 *   - page (optional): Page no for search podcasts
 *   - PerPage (optional): Per page result for search podcasts
 */
router.get("/", searchPodcastValidate(), validate, searchPodcasts);
/**
 * Route: GET /podcast/info
 * Description: Get detail info about podcast
 * Request Body:
 *   - id (id or feedUrl only one require): Id of the podcast store in DB
 *   - feedUrl (id or feedUrl only one require): The URL of the podcast rss feed
 */
router.get("/info", podcastInfoValidate(), validate, getPodcastInfo);

/**
 * Route: POST /podcast/add
 * Description: Add a new podcast
 * Request Body:
 *   - feedUrl (required): The URL of the podcast rss feed
 */
router.post("/add", addPodcastValidate(), validate, addPodcastToDb);

module.exports = router;
