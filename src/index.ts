import dotenv from "dotenv";
import initializeApp from "./app";
import connectToDb from "./db";

dotenv.config();
const port = process.env.PORT || 8000;

declare global {
  namespace Express {
    export interface User {
      _id: string;
      userName: string;
      image: string | null;
      email: string | null;
      isVerified: boolean;
    }
  }
}

async function startServer() {
  try {
    // connect to db
    await connectToDb();

    // create app
    const app = initializeApp();

    app.listen(port, () => {
      console.log("server is running on port:", port);
    });
  } catch (error) {
    console.error("Error occur while connecting to server:", error);
  }
}

startServer();
