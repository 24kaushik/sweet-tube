import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      success: err.success,
    });
  } else {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error!",
      success: false,
    });
  }
};
