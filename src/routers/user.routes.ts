import { Router } from "express";
import {
  getUserController,
  updateForwardInterval,
  updatePlaybackSpeed,
  updateRewindInterval,
  getUserSubscriptions,
  handleSubscribePodcast,
  getUserFavorites,
  handleFavoritePodcastEp,
} from "../controllers/user.controllers";
import { podcastByIdValidate } from "../validations/podcast.validation";
import validate from "../validations/validate";
import {
  toggleFavoriteValidate,
  validateForwardInterval,
  validatePlaybackSpeed,
  validateRewindInterval,
} from "../validations/user.validation";
import passport from "passport";

const router = Router();

/**
 * Route: GET /user
 * Description: To get login user data
 * Note: Send request with credentials true
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getUserController
);

/**
 * Route: PATCH /user/setting/playback-speed
 * Description: update user playback speed
 * Note: Send request with credentials true
 * Request Body:
 *  - playbackSpeed (required): playback speed which have to set
 */
router.patch(
  "/setting/playback-speed",
  validatePlaybackSpeed(),
  validate,
  passport.authenticate("jwt", { session: false }),
  updatePlaybackSpeed
);

/**
 * Route: PATCH /user/setting/rewind-interval
 * Description: update user rewind interval
 * Note: Send request with credentials true
 * Request Body:
 *  - rewindInterval (required): rewind interval which have to set
 */
router.patch(
  "/setting/rewind-interval",
  validateRewindInterval(),
  validate,
  passport.authenticate("jwt", { session: false }),
  updateRewindInterval
);

/**
 * Route: PATCH /user/setting/forward-interval
 * Description: update user forward interval
 * Note: Send request with credentials true
 * Request Body:
 *  - forwardInterval (required): forward interval which have to set
 */
router.patch(
  "/setting/forward-interval",
  validateForwardInterval(),
  validate,
  passport.authenticate("jwt", { session: false }),
  updateForwardInterval
);

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
  passport.authenticate("jwt", { session: false }),
  handleSubscribePodcast
);

/**
 * Route: GET /user/subscriptions
 * Description: To get login user subscriptions
 * Note: Send request with credentials true
 */
router.get(
  "/subscriptions",
  passport.authenticate("jwt", { session: false }),
  getUserSubscriptions
);

/**
 * Route: POST /user/toggle-favorite
 * Description: favorite or unfavorite podcast episode
 * Request Body:
 *  - podcastId (required): id of the podcast which is store in db
 *  - episode (required): episode data of the podcast which is store in db
 * Note: Send request with credentials true
 */
router.post(
  "/toggle-favorite",
  toggleFavoriteValidate(),
  validate,
  passport.authenticate("jwt", { session: false }),
  handleFavoritePodcastEp
);

/**
 * Route: GET /user/favorites
 * Description: To get login user favorites
 * Note: Send request with credentials true
 */
router.get(
  "/favorites",
  passport.authenticate("jwt", { session: false }),
  getUserFavorites
);

export default router;
