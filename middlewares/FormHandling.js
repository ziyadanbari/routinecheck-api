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
    const { options } = req.body;

    options.forEach(({ title, activated, notified }, i) => {
      if (!title || !validator.isBoolean(String(activated))) {
        throw [400, "Invalid input fields."];
      }

      if (title !== "email" && title !== "whatsapp") {
        throw [400, "Invalid option."];
      }

      if (
        title === "email" &&
        notified &&
        !validator.isEmail(String(notified))
      ) {
        throw [400, "Invalid email address."];
      }

      if (
        title === "whatsapp" &&
        notified &&
        !validator.isMobilePhone(
          notified.startsWith("+") ? `${notified}` : `+${notified}`
        )
      ) {
        throw [400, "Invalid phone number."];
      }

      if (title === "whatsapp") {
        options[i] = {
          ...options[i],
          notified: notified ? `${notified.replace("+", "")}` : undefined,
          activated: String(activated),
        };
      }
    });

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
