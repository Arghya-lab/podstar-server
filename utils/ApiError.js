const ApiError = (
  res,
  statusCode,
  message = "Something went wrong",
  error = ""
) => res.status(statusCode).json(error ? { message, error } : { message });

module.exports = ApiError;
