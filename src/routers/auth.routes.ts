import { Router } from "express";
import passport from "passport";
import {
  handleChangePassword,
  handleLocalSignup,
  handleResendVerifyEmail,
  handleResetPasswordWithToken,
  handleSendForgotPasswordToken,
  handleValidateEmailForForgotPassword,
  handleVerifyEmail,
} from "../controllers/auth.controllers";
import {
  localLoginValidate,
  localSignupValidate,
  emailForForgotPasswordValidate,
  resetPasswordWithTokenValidate,
  changePasswordValidate,
} from "../validations/auth.validation";
import validate from "../validations/validate";
import { verifyEmailValidate } from "../validations/email.validation";
import ApiError from "../utils/ApiError";
import ApiSuccess from "../utils/ApiSuccess";

const router = Router();

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
    successRedirect: `${process.env.CLIENT_BASE_URL}`,
    // failureRedirect: "/auth/login-failed",
  })
);

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
  return ApiSuccess(res, undefined, "Successfully login");
});

/**
 * Route: GET /auth/login-failed
 * Description: route to show failed in login used only by server user will get the response,
 * Caution: User will not use this it will automatically call by server route as redirect
 */
router.get("/login-failed", (req, res) => {
  return ApiError(res, 400, "Failed to login");
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
router.get("/logout", (req, res) => {
  req.logout({ keepSessionInfo: false }, (err) => {
    // if (err) {
    //   return ApiError(res, 500, "Error occur during logout.");
    // }
    return res.redirect(process.env.CLIENT_BASE_URL!);
  });
});

/**
 * Route: POST /auth/change-password
 * Description: change password with existing password
 * Request Body:
 *   - password (required): existing password to verify.
 *   - newPassword (required): new password which will the old.
 * Note: Send request with credentials true
 */
router.post(
  "/change-password",
  changePasswordValidate(),
  validate,
  handleChangePassword
);

/**
 * Route: GET /auth/validateEmail-for-forgotPassword
 * Description: check if email is eligible to reset password for local account
 * Request Query:
 *   - email (required): Email for check eligibility to reset password.
 */
router.get(
  "/validateEmail-for-forgotPassword",
  emailForForgotPasswordValidate(),
  validate,
  handleValidateEmailForForgotPassword
);

/**
 * Route: GET /auth/send-forgotPassword-token
 * Description: send token via email for forgot password
 * Request Query:
 *   - email (required): Email for check eligibility to reset password and send otp token.
 */
router.get(
  "/send-forgotPassword-token",
  emailForForgotPasswordValidate(),
  validate,
  handleSendForgotPasswordToken
);

/**
 * Route: POST /auth/resetPassword-withToken
 * Description: reset forgot password with token
 * Request Body:
 *   - email (required): Email for reset password.
 *   - password (required): Password to set.
 *   - token (required): Forgot password token which was send via email to reset password.
 */
router.post(
  "/resetPassword-withToken",
  resetPasswordWithTokenValidate(),
  validate,
  handleResetPasswordWithToken
);

export default router;
