import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import corsConfig from "./config/cors.config";
import startServer from "./utils/startServer";
import sessionConfig from "./config/session.config";
import localStrategyConfig from "./config/localStrategy.config";
import googleStrategyConfig from "./config/googleStrategy.config";
import authRoute from "./routers/auth.routes";
import podcastRoute from "./routers/podcast.routes";
import userRoute from "./routers/user.routes";

/* configs */
dotenv.config();

declare global {
  namespace Express {
    export interface User {
      _id: string;
      userName: string;
      image: string | null;
      email: string | null;
      isVerified: boolean;
    }
  }
}
passport.use(localStrategyConfig);
passport.use(googleStrategyConfig);
const app = express();
app.use(corsConfig);
app.use(sessionConfig);
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

// routes
app.get("/", (_, res) => {
  res.status(200).json({ message: "Welcome to Podstar server.." });
});
app.use("/auth", authRoute);
app.use("/podcast", podcastRoute);
app.use("/user", userRoute);

// start the server
startServer(app);
