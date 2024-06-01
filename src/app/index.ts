import express from "express";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwtStrategyConfig from "../config/JwtStrategy.config";
import googleStrategyConfig from "../config/googleStrategy.config";
import localStrategyConfig from "../config/localStrategy.config";
import router from "../routers";

export default function initializeApp() {
  const app = express();
  app.use(
    cors({
      origin: process.env.CLIENT_BASE_URL,
      methods: "GET,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );

  app.use(passport.initialize());
  passport.use(jwtStrategyConfig);
  passport.use(googleStrategyConfig);
  passport.use(localStrategyConfig);
  app.use(express.json());
  app.use(cookieParser());

  passport.serializeUser(function (user, done) {
    // null is for errors
    done(null, user);
  });
  passport.deserializeUser(function (user: any, done) {
    // null is for errors
    done(null, user);
  });

  // health route
  app.get("/", (_, res) => {
    res.status(200).json({ message: "Welcome to Podstar server." });
  });

  // all routes
  app.use(router);

  return app;
}
