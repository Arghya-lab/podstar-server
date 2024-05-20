import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../utils/ApiError";
import {
  LocalSignupRequest,
  ValidateEmailForForgotPasswordRequest,
  VerifyEmailRequest,
} from "../@types/request";
import User from "../models/user.model";
import sendMail from "../utils/sendMail";
import ApiSuccess from "../utils/ApiSuccess";

//*   ------------------------ Local email signup controller  ------------------------ *//
export const handleLocalSignup = async (
  req: LocalSignupRequest,
  res: Response
) => {
  try {
    const { userName, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) return ApiError(res, 400, "User already with same email.");

    const hash = bcrypt.hashSync(password, 10);
    const verifyToken = encodeURIComponent(uuidv4());

    await User.create({
      email,
      userName,
      hash,
      isVerified: false,
      verifyToken,
      verifyTokenExpiry: Date.now() + 1000 * 60 * 60,
    });

    sendMail({
      userName,
      email,
      token: verifyToken,
      type: "VERIFY",
    });

    // add verify email route redirect
    return ApiSuccess(
      res,
      undefined,
      "successfully signup now verify email login with credentials."
    );
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Email verification after signup controller  ------------------------ *//
export const handleVerifyEmail = async (
  req: VerifyEmailRequest,
  res: Response
) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verifyToken: token });
    if (!user) return ApiError(res, 404, "Invalid token.");

    if (user.verifyTokenExpiry) {
      if (user.verifyTokenExpiry > Date.now()) {
        await User.findByIdAndUpdate(user._id, {
          isVerified: true,
          verifyToken: null,
          verifyTokenExpiry: null,
        });

        return ApiSuccess(
          res,
          { isTokenExpired: false },
          "Successfully verified email."
        );
      } else {
        return ApiSuccess(res, { isTokenExpired: true }, "Token is expired.");
      }
    }

    return ApiError(res, 500, "Internal server error.");
  } catch (error) {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Resending verification email link controller for local email  ------------------------ *//
export const handleResendVerifyEmail = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return ApiError(res, 400, "Unauthorize access denied.");

    if (user?.isVerified)
      return ApiError(res, 400, "You are already verified.");

    const verifyToken = encodeURIComponent(uuidv4());

    const savedUser = await User.findById(user._id);
    if (!savedUser || !savedUser.email) {
      return ApiError(res, 400, "Unauthorize access denied.");
    }

    // if user server sended previous email duration not more than 2 min then return error

    await User.findByIdAndUpdate(savedUser._id, {
      verifyToken,
      verifyTokenExpiry: Date.now() + 1000 * 60 * 60,
    });

    sendMail({
      userName: savedUser.userName,
      email: savedUser.email,
      token: verifyToken,
      type: "VERIFY",
    });

    return ApiSuccess(
      res,
      undefined,
      "Successfully send email verification link."
    );
  } catch (error) {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ change password  ------------------------ *//
export const handleChangePassword = async (req: Request, res: Response) => {
  try {
    const { password, newPassword } = req.body;
    const expressUser = req.user;

    if (!expressUser) return ApiError(res, 400, "Unauthorize access denied.");

    const user = await User.findById(expressUser._id);
    if (!user || !user.hash) {
      return ApiError(res, 400, "Unauthorize access denied.");
    }

    const match = await bcrypt.compare(password, user.hash);
    if (!match) return ApiError(res, 400, "Wrong password.");

    const hash = bcrypt.hashSync(newPassword, 10);
    User.findByIdAndUpdate(user._id, {
      hash,
    })
      .then(() => {
        return ApiSuccess(
          res,
          undefined,
          "Successfully change email password."
        );
      })
      .catch(() => {
        return ApiError(res, 500, "Error occur while changing password.");
      });
  } catch (error) {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Check for if the email is eligible for reset password controller  ------------------------ *//
export const handleValidateEmailForForgotPassword = async (
  req: ValidateEmailForForgotPasswordRequest,
  res: Response
) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (user?.hash) {
      return ApiSuccess(res, undefined, "Yeah you can reset password.");
    }

    return ApiError(res, 400, "You are unauthorize to reset password.");
  } catch (error) {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller to send otp token in email for forgat password  ------------------------ *//
export const handleSendForgotPasswordToken = async (
  req: ValidateEmailForForgotPasswordRequest,
  res: Response
) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });

    if (user?.hash) {
      const forgotPasswordToken = Math.floor(
        Math.random() * 10 ** 6
      ).toString(); // 6 digit token

      await User.findByIdAndUpdate(user._id, {
        forgotPasswordToken,
        forgotPasswordTokenExpiry: Date.now() + 1000 * 60 * 30, // token will expire in 30min
      });

      sendMail({
        userName: user.userName,
        email,
        token: forgotPasswordToken,
        type: "RESET",
      });

      return ApiSuccess(
        res,
        undefined,
        "Token is send in email and it will expire in 30 min."
      );
    }

    return ApiError(res, 400, "Unauthorize access denied.");
  } catch (error) {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ------------------------ Controller for update password with token  ------------------------ *//
export const handleResetPasswordWithToken = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password, token } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.forgotPasswordToken || !user.forgotPasswordTokenExpiry) {
      return ApiError(res, 400, "Unauthorize access denied.");
    }
    if (user.forgotPasswordToken !== token) {
      return ApiError(res, 400, "Wrong token.");
    }
    if (user.forgotPasswordTokenExpiry < Date.now()) {
      return ApiError(res, 400, "Token expired.");
    }

    const hash = bcrypt.hashSync(password, 10);
    User.findByIdAndUpdate(user._id, {
      hash,
      forgotPasswordToken: null,
      forgotPasswordTokenExpiry: null,
    })
      .then(() => {
        return ApiSuccess(res, undefined, "Password updated successfully.");
      })
      .catch(() => {
        return ApiError(
          res,
          500,
          "Error occur in server while updating password."
        );
      });
  } catch (error) {
    return ApiError(res, 500, "Internal server error.");
  }
};
