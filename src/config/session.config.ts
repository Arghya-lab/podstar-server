import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const sessionConfig = session({
  secret: process.env.COOKIE_KEY!,
  resave: true,
  saveUninitialized: true,
});

export default sessionConfig;
