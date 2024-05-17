import { Router } from "express";
import {
  getUserController,
  getUserSubscriptions,
  handleSubscribePodcast,
} from "../controllers/user.controllers";
import { podcastByIdValidate } from "../validations/podcast.validation";
import validate from "../validations/validate";

const router = Router();

/**
 * Route: GET /user
 * Description: To get login user data
 * Note: Send request with credentials true
 */
router.get("/", getUserController);

/**
 * Route: POST /user/toggle-subscribe/:id
 * Description: subscribe or unsubscribe podcast by podcast id
 * Request Param:
 *   - id (require): Id of the podcast store in DB
 * Note: Send request with credentials true
 */
router.post(
  "/toggle-subscribe/:id",
  podcastByIdValidate(),
  validate,
  handleSubscribePodcast
);

/**
 * Route: GET /user/subscriptions
 * Description: To get login user subscriptions
 * Note: Send request with credentials true
 */
router.get("/subscriptions", getUserSubscriptions);

export default router;
