import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();

const localStrategyConfig = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    session: false,
  },
  async function (email, password, done) {
    try {
      let user = await User.findOne({ email });

      if (user && user.hash) {
        const match = await bcrypt.compare(password, user.hash);
        if (match) {
          // user = await User.findOne({ email }).select(
          //   "_id userName isVerified image email"
          // );
          // if (user) {
          //   return done(null, user || undefined);
          // } else {
          //   return done(null, false, { message: "Something went wrong." });
          // }

          return done(null, user);
        } else {
          return done(null, false, { message: "Unauthorize access denied." });
        }
      } else {
        return done(null, false, { message: "Unauthorize access denied." });
      }
    } catch {
      return done("Internal server error.");
    }
  }
);

export default localStrategyConfig;
