import { Response } from "express";

export default function ApiSuccess(
  res: Response,
  data?: any,
  message = "Successfully fetched data.",
  statusCode = 200
) {
  return res.status(statusCode).json({ success: true, message, data });
}
