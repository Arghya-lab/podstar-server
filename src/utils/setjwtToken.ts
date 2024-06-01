import { Response } from "express";
import jwt from "jsonwebtoken";

export default function setJwtToken(res: Response, _id: string) {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET!);
  res.cookie("x-auth-cookie", token, {
    httpOnly: true, // Cookie is not accessible via JavaScript
    secure: true, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 30, // Cookie expiry in milliseconds
  });
}
