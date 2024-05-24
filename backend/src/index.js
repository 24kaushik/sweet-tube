import connectDB from "./db/db.js";
import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config({path : "./.env"});

const port = process.env.PORT || 6969;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server listening on port", port);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!!!", err);
  });
