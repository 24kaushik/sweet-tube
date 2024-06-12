import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    const response = {
      statusCode: err.statusCode,
      message: err.message,
      success: err.success,
    };

    if (process.env.ENVIRONMENT == "dev") {
      response.stack = err.stack;
    }
    res.status(err.statusCode).json(response);

  } else {
    const response = {
      statusCode: 500,
      message:
        process.env.ENVIRONMENT == "dev"
          ? err.message
          : "Internal server error!",
      success: false,
    };

    if (process.env.ENVIRONMENT == "dev") {
      console.log(err);
      response.stack = err.stack;
    }

    res.status(500).json(response);
  }
};
