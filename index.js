const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectToDb = require("./db");
const podcastRoute = require("./routers/podcast.router");

dotenv.config();
const port = Number(process.env.PORT) || 8000;

// configurations to work in your application
const app = express();
app.use(cors());
app.use(express.json())

// connect to db
connectToDb();

// routes
app.use("/podcast", podcastRoute)

// start the server
app
  .listen(port, () => {
    console.log("Server running at PORT: ", port);
  })
  .on("error", (error) => {
    console.error("Failed to start the server. 👎\n", error);
  });
