import { Response } from "express";

export default function ApiError(
  res: Response,
  statusCode: number,
  message = "Something went wrong",
  error = ""
) {
  return res
    .status(statusCode)
    .json(
      error ? { success: false, message, error } : { success: false, message }
    );
}
