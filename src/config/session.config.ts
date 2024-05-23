import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default function createSessionConfig() {
  if (!mongoose.connection.readyState) {
    throw new Error("Mongoose connection is not established yet");
  }

  return session({
    secret: process.env.COOKIE_KEY!,
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified. Choosing false is useful for implementing login sessions, reducing server storage usage
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 day
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "development" ? undefined : true, // Ensure this is true in production
      sameSite: process.env.ENVIRONMENT === "development" ? undefined : "none", // Required for cross-site cookies
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  });
}
