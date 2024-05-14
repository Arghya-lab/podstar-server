import { query } from "express-validator";

export const verifyEmailValidate = () => [
  query("token")
    .trim()
    .notEmpty()
    .withMessage("token required.")
    .isString()
    .withMessage("token have to be string."),
];
