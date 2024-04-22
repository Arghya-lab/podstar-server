const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

const validate = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    return next();
  }

  const firstError = error.array()[0];
  // 422: Unprocessable Entity
  return ApiError(res, 422, "Invalid data receive.", firstError.msg);
};

module.exports = validate;
