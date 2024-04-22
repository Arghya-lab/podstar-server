const dotenv = require("dotenv");
const connectToDb = require("./db");
const app = require("./app");

dotenv.config();
const port = Number(process.env.PORT) || 8000;

// connect to db
connectToDb();

// start the server
app
  .listen(port, () => {
    console.log("Server running at PORT: ", port);
  })
  .on("error", (error) => {
    console.error("Failed to start the server. 👎\n", error);
  });
