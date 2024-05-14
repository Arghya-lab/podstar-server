import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../utils/ApiError";
import { LocalSignupRequest, VerifyEmailRequest } from "../@types/request";
import User from "../models/user.model";
import sendMail from "../utils/sendMail";

//*   ----- Local email signup controller  ----- *//
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
    return res.status(200).json({
      success: true,
      message: "successfully signup now verify email login with credentials.",
    });
  } catch {
    return ApiError(res, 500, "Internal server error.");
  }
};

export const handleVerifyEmail = async (
  req: VerifyEmailRequest,
  res: Response
) => {
  try {
    const { token } = req.query;
    console.log(token);

    const user = await User.findOne({ verifyToken: token });
    if (!user) return ApiError(res, 404, "Invalid token.");

    if (user.verifyTokenExpiry) {
      if (user.verifyTokenExpiry > Date.now()) {
        await User.findByIdAndUpdate(user._id, {
          isVerified: true,
          verifyToken: null,
          verifyTokenExpiry: null,
        });

        return res.status(200).json({
          success: true,
          isTokenExpired: false,
          message: "Successfully verified email.",
        });
      } else {
        return res.status(200).json({
          success: false,
          isTokenExpired: true,
          message: "Token is expired.",
        });
      }
    }

    return ApiError(res, 500, "Internal server error.");
  } catch (error) {
    return ApiError(res, 500, "Internal server error.");
  }
};

export const handleResendVerifyEmail = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return ApiError(res, 400, "Unauthorize access denied.");

    if (user?.isVerified)
      return ApiError(res, 400, "You are already verified.");

    const verifyToken = encodeURIComponent(uuidv4());

    const savedUser = await User.findById(user._id);
    if (!savedUser || !savedUser.email)
      return ApiError(res, 400, "Unauthorize access denied.");

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

    return res.status(200).json({
      success: true,
      message: "Successfully send email verification link.",
    });
  } catch (error) {
    return ApiError(res, 500, "Internal server error.");
  }
};

//*   ----- User logout controller  ----- *//
export const handleLogout = (req: Request, res: Response) => {
  req.logout({ keepSessionInfo: false }, (err) => {
    if (err) {
      return res.json({ message: "Error occur during logout." });
    }
    return res.json({ message: "Successfully logout." });
  });
};
