"use strict";

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const startServer = require("./utils/startServer");
const podcastRoute = require("./routers/podcast.router");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.get("/", (_, res) => {
  res.status(200).json({ message: "server is up and running." });
});
app.use("/podcast", podcastRoute);

// start the server
startServer(app);
