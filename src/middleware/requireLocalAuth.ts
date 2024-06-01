import { NextFunction, Request, Response } from "express";
import Passport from "passport";

export default function requireLocalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  Passport.authenticate(
    "local",
    (err: any, user?: Express.User, info?: any) => {
      if (err) {
        next(err);
      }
      if (!user) {
        next(info);
      }
      req.user = user;
      next();
    }
  )(req, res, next);
}
