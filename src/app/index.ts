import express from "express";
import passport from "passport";
import cors from "cors";
import localStrategyConfig from "../config/localStrategy.config";
import googleStrategyConfig from "../config/googleStrategy.config";
import createSession from "../config/session.config";
import router from "../routers";

export default function initializeApp() {
  passport.use(localStrategyConfig);
  passport.use(googleStrategyConfig);

  const app = express();
  app.use(
    cors({
      origin: process.env.CLIENT_BASE_URL,
      methods: "GET,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );
  app.use(createSession());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.json());

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
