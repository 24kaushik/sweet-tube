import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes import
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

//Routes declaration
app.use("/api/v1/users", userRouter);

//Error Middleware
app.use(errorHandler)

export { app };
