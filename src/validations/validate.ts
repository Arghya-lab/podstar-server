import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError";

export default function validate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = validationResult(req);
  if (error.isEmpty()) {
    return next();
  }

  const firstError = error.array()[0];
  // 422: Unprocessable Entity
  return ApiError(res, 422, "Invalid data receive.", firstError.msg);
}
