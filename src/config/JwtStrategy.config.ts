import { Strategy as JwtStrategy } from "passport-jwt";
import dotenv from "dotenv";
import User from "../models/user.model";
import { Request } from "express";

dotenv.config();

const cookieExtractor = function (req: Request): string | null {
  let token: string | null = null;

  if (req && req.cookies) {
    token = req.cookies["x-auth-cookie"];
  }
  // x-auth-token

  return token;
};

const jwtStrategyConfig = new JwtStrategy(
  {
    secretOrKey: process.env.JWT_SECRET!,
    jwtFromRequest: (req: Request) => cookieExtractor(req),
  },
  async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload._id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error);
    }
  }
);

export default jwtStrategyConfig;
