import { Router } from "express";
import {
  addPodcastValidate,
  podcastByIdValidate,
  podcastInfoValidate,
  searchPodcastValidate,
} from "../validations/podcast.validation";
import validate from "../validations/validate";
import {
  addPodcastToDb,
  getPodcastById,
  getPodcastInfo,
  getTrendingPodcasts,
  searchPodcasts,
} from "../controllers/podcast.controllers";

const router = Router();

/**
 * Route: GET /podcast
 * Description: Search podcasts
 * Request Query:
 *   - query (required): Query to search podcasts
 *   - page (optional): Page no for search podcasts
 *   - perPage (optional): Per page result for search podcasts
 */
router.get("/", searchPodcastValidate(), validate, searchPodcasts);

/**
 * Route: GET /podcast/trending
 * Description: Get podcast trending which is fetched from podcastIndex
 */
router.get("/trending", getTrendingPodcasts);

/**
 * Route: GET /podcast/info
 * Description: Get detail info about podcast
 * Request Query:
 *   - id (id or feedUrl only one require): Id of the podcast store in DB
 */
router.get("/info", podcastInfoValidate(), validate, getPodcastInfo);

/**
 * Route: POST /podcast/add
 * Description: Add a new podcast
 * Request Body:
 *   - feedUrl (required): The URL of the podcast rss feed
 */
router.post("/add", addPodcastValidate(), validate, addPodcastToDb);

/**
 * Route: GET /podcast/:id
 * Description: Get podcast from db
 * Request Param:
 *   - id (require): Id of the podcast store in DB
 */
router.get("/:id", podcastByIdValidate(), validate, getPodcastById);

export default router;
