import { Express } from "express";
import connectToDb from "../db";

export default async function startServer(app: Express) {
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
}
