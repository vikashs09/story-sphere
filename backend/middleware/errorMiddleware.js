const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
};

const errorMiddleware = (
  error,
  req,
  res,
  next
) => {
  console.error(error);

  const statusCode =
    error.statusCode || 500;

  const message =
    error.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack
    })
  });
};

module.exports = {
  notFound,
  errorMiddleware
};