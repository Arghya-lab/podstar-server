import { body, query } from "express-validator";
import MailChecker from "mailchecker";

const userNameValidate = body("userName")
  .trim()
  .notEmpty()
  .withMessage("userName is required.")
  .isString()
  .withMessage("userName have to be string.")
  .isLength({ min: 4, max: 16 })
  .withMessage("userName length should be between 4 to 16.");

const emailValidate = body("email")
  .trim()
  .notEmpty()
  .withMessage("email is required.")
  .custom((value) => MailChecker.isValid(value))
  // .isEmail()
  .withMessage("email is not valid.");

const passwordValidate = body("password")
  .trim()
  .notEmpty()
  .withMessage("password is required.")
  .isString()
  .withMessage("password have to be string.")
  .isLength({ min: 8 })
  .withMessage("password should be at least 8 char long.")
  .isLength({ max: 32 })
  .withMessage("password length more than 32 is not acceptable.");

export const localSignupValidate = () => [
  userNameValidate,
  emailValidate,
  passwordValidate,
];

export const localLoginValidate = () => [emailValidate, passwordValidate];

export const changePasswordValidate = () => [
  passwordValidate,
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("password is required.")
    .isString()
    .withMessage("password have to be string.")
    .isLength({ min: 8 })
    .withMessage("password should be at least 8 char long.")
    .isLength({ max: 32 })
    .withMessage("password length more than 32 is not acceptable."),
];

export const emailForForgotPasswordValidate = () => [
  query("email")
    .trim()
    .notEmpty()
    .withMessage("email is required.")
    .custom((value) => MailChecker.isValid(value))
    .withMessage("email is not valid."),
];

export const resetPasswordWithTokenValidate = () => [
  emailValidate,
  passwordValidate,
  body("token")
    .trim()
    .notEmpty()
    .withMessage("token is required.")
    .isString()
    .withMessage("token have to be string.")
    .isLength({ min: 6, max: 6 })
    .withMessage("token length should be 6 char long."),
];
