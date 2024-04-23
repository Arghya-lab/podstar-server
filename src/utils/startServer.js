const connectToDb = require("../db");

const startServer = async (app) => {
  const port = process.env.PORT || 8000;

  try {
    // connect to db
    await connectToDb();

    app.listen(port, () => {
      console.log("server is running on port:", port);
    });
  } catch (error) {
    console.error("Error occur while connecting to server:", error);
  }
};

module.exports = startServer;
