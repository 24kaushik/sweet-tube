import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    const response = {
      statusCode: err.statusCode,
      message: err.message,
      success: err.success,
    };

    if (
      process.env.ENVIRONMENT == "dev" ||
      process.env.ENVIRONMENT == "development"
    ) {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
  } else {    
    if (
      process.env.ENVIRONMENT == "dev" ||
      process.env.ENVIRONMENT == "development"
    ) {
      console.log(err);
    }
    
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error!",
      success: false,
    });
  }
};
