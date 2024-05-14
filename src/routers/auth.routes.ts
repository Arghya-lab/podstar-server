import { Request, Response, Router } from "express";
import passport from "passport";
import {
  handleLocalSignup,
  handleLogout,
  handleResendVerifyEmail,
  handleVerifyEmail,
} from "../controllers/auth.controllers";
import {
  localLoginValidate,
  localSignupValidate,
} from "../validations/auth.validation";
import validate from "../validations/validate";
import { verifyEmailValidate } from "../validations/email.validation";

const router = Router();

/*
 ----------------------------------------TODO------------------------------------------
 - create a route for email verification                                              |
 - route for forgot password user jwt to store password data                          |
 - if user is not verified then tell user to verify first in frontend                 |
 - create a route for sending verification in case user is forgot to verify           |
 --------------------------------------------------------------------------------------
*/

router.get("/user", (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: "successfully got user data.",
      user: req.user,
    });
  }
  return res.status(404).json({
    success: false,
    message: "user not found please login.",
  });
});

/**
 * Route: POST /auth/signup
 * Description: signup with local account
 * Request Body:
 *   - userName (required): User userName for signup(local account)
 *   - email (required): User email for signup(local account)
 *   - password (required): Password for signup(local account)
 */
router.post("/signup", localSignupValidate(), validate, handleLocalSignup);

/**
 * Route: GET /auth/verify-email
 * Description: verify-email for local account
 * Request Query:
 *   - token (required): Token for verify local account.
 */
router.get("/verify-email", verifyEmailValidate(), validate, handleVerifyEmail);

/**
 * Route: GET /auth/resend-verify-email
 * Description: If the verification link is expired then resend verification link route for local account
 */
router.get("/resend-verify-email", handleResendVerifyEmail);

/**
 * Route: GET /auth/login-success
 * Description: route to show success in login used only by server user will get the response,
 * Caution: User will not use this it will automatically call by server route as redirect
 */
router.get("/login-success", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Successfully login",
  });
});

/**
 * Route: GET /auth/login-failed
 * Description: route to show failed in login used only by server user will get the response,
 * Caution: User will not use this it will automatically call by server route as redirect
 */
router.get("/login-failed", (req, res) => {
  return res.status(400).json({
    success: false,
    message: "Failed to login",
  });
});

/**
 * Route: POST /auth/login
 * Description: login with local account
 * Request Body:
 *   - email (required): User email to login(local account)
 *   - password (required): Password for login(local account)
 */
router.post(
  "/login",
  localLoginValidate(),
  validate,
  passport.authenticate("local", {
    failureRedirect: "/auth/login-failed",
    successRedirect: "/auth/login-success",
  })
);

/**
 * Route: GET /auth/logout
 * Description: Auth logout
 */
router.get("/logout", handleLogout);

/**
 * Route: GET /auth/google
 * Description: auth with google
 */
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

/**
 * Route: GET /auth/google/callback
 * Description: callback route for google to redirect to
 * Caution: User will not use this it will automatically call by google
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_BASE_URL}/login`,
    failureRedirect: "/auth/login-failed",
  })
);

export default router;
