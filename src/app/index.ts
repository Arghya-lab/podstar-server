import express from "express";
import passport from "passport";
import localStrategyConfig from "../config/localStrategy.config";
import googleStrategyConfig from "../config/googleStrategy.config";
import corsConfig from "../config/cors.config";
import createSessionConfig from "../config/session.config";
import router from "../routers";

export default function initializeApp() {
  passport.use(localStrategyConfig);
  passport.use(googleStrategyConfig);

  const app = express();
  app.use(corsConfig);
  app.use(createSessionConfig());
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
