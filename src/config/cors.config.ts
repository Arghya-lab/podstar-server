import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const corsConfig = cors({
  origin: process.env.CLIENT_BASE_URL,
  methods: "GET,PUT,PATCH,POST,DELETE",
  credentials: true,
});

export default corsConfig;
