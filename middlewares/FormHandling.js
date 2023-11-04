import validator from "validator";
import { User } from "../models/User.js";

/**
 * Validates registration form fields.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const RegisterFormHandling = async (req, res, next) => {
  const { username = "", email = "", password = "" } = req.body;
  try {
    if (
      validator.isEmpty(String(username)) ||
      validator.isEmpty(String(email)) ||
      validator.isEmpty(String(password))
    ) {
      throw [400, "All fields are required."];
    } else if (!validator.isEmail(email)) {
      throw [400, "Invalid email address."];
    } else {
      return next();
    }
  } catch (error) {
    console.error(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

/**
 * Validates login form fields.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const LoginFormHandling = async (req, res, next) => {
  const { email = "", password = "" } = req.body;
  try {
    if (
      validator.isEmpty(String(email)) ||
      validator.isEmpty(String(password))
    ) {
      throw [400, "All fields are required."];
    } else {
      return next();
    }
  } catch (error) {
    console.error(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

/**
 * Handles form data for editing user profile.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const EditingFormHandling = async (req, res, next) => {
  try {
    const { body: form } = req;
    const { username, email } = form;
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const user = await User.findById(userId);

    if (user.email === email) {
      req.body.email = undefined;
    }
    if (user.username === username) {
      req.body.username = undefined;
    }

    return next();
  } catch (error) {
    console.error(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

/**
 * Validates form data for changing user password.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const PasswordChangeFormHandling = async (req, res, next) => {
  try {
    const { password = "", newPassword = "", passwordConfirm = "" } = req.body;
    if (
      validator.isEmpty(String(password)) ||
      validator.isEmpty(String(newPassword)) ||
      validator.isEmpty(String(passwordConfirm))
    ) {
      throw [400, "All password fields are required."];
    } else if (newPassword.length < 8) {
      throw [400, "The password must be at least 8 characters."];
    }

    return next();
  } catch (error) {
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

/**
 * Handles form data for TON trait (email/whatsapp) settings.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const TONTraitFormHandling = async (req, res, next) => {
  try {
    const { option = "", active = null, notified = "" } = req.body;
    if (!option || !validator.isBoolean(String(active))) {
      throw [400, "Invalid input fields."];
    } else if (option) {
      if (option !== "email" && option !== "whatsapp") {
        throw [400, "Invalid option."];
      } else if (
        option === "email" &&
        notified &&
        !validator.isEmail(String(notified))
      ) {
        throw [400, "Invalid email address."];
      } else if (
        option === "whatsapp" &&
        notified &&
        !validator.isMobilePhone(`${notified}`)
      ) {
        throw [400, "Invalid phone number."];
      }
    }
    req.body = {
      ...req.body,
      notified: notified.replaceAll("+", "") || undefined,
      active: String(active),
    };

    return next();
  } catch (error) {
    console.error(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

const ResetPasswordFormHandling = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token) throw [400, "Token needed"];
    else if (!newPassword && !confirmPassword) return next();
    if (newPassword.length < 8 && newPassword !== confirmPassword)
      throw [400, "password doesn't matched"];
    return next();
  } catch (error) {
    console.error(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

export {
  RegisterFormHandling,
  LoginFormHandling,
  EditingFormHandling,
  PasswordChangeFormHandling,
  TONTraitFormHandling,
  ResetPasswordFormHandling,
};
