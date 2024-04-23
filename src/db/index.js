const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to db. ");
  } catch (error) {
    console.error("Failed to db. 👎\n", error);
    process.exit(1);
  }
};

module.exports = connectToDb;
