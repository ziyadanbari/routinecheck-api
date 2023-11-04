import { User } from "../models/User.js";

const CheckUserExistence = async (req, res, next) => {
  try {
    const form = req.body;
    const { email } = form;
    if (!email) throw [400, "fields required"];
    const { email: username } = form;
    const query = {
      $or: [{ email }, { username }],
    };
    const userExistence = await User.findOne(query).exec();
    if (userExistence) {
      req.DBuser = userExistence;
      return next();
    }
    throw [404, "User not found"];
  } catch ([status, message]) {
    return res.status(status).json({ message });
  }
};
export { CheckUserExistence };
