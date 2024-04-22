"use strict";
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const podcastRoute = require("../routers/podcast.router");

const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());

// routes
app.use("/podcast", podcastRoute);


// path must route to lambda (express/server.js)
app.use("/.netlify/functions/server", router); 

module.exports = app;
module.exports.handler = serverless(app);
