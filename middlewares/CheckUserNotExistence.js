import { User } from "../models/User.js";

const CheckUserNotExistence = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const findEmail = await User.findOne({ email }).exec();
    const findUserName = await User.findOne({ username }).exec();
    if (findUserName) throw [409, "Cannot use this username"];
    else if (findEmail) throw [409, "Cannot use this email"];
    else return next();
  } catch ([status, message]) {
    res.status(status).json({ message });
  }
};
export { CheckUserNotExistence };
