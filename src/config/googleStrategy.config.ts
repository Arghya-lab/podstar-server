import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();

const googleStrategyConfig = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    proxy: true,
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      let oldUser = await User.findOne({ googleId: profile.id }).select(
        "_id userName isVerified image email"
      );
      if (oldUser) return done(null, oldUser);

      const newUser = await User.create({
        googleId: profile.id,
        userName: profile.displayName,
        image: profile._json.picture || null,
        email: profile._json.email || null,
        isVerified: true,
      });

      done(null, newUser);
    } catch (error) {
      done(error);
    }
  }
);
export default googleStrategyConfig;
