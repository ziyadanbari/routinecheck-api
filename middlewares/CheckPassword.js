import validator from "validator";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
const CheckPassword = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { password: DBpassword } = await User.findById(userId);
    const { password, newPassword, passwordConfirm } = req.body;
    const isCorrect = bcrypt.compareSync(password, DBpassword);
    if (!isCorrect) throw [403, "Password is incorrect"];
    else if (newPassword !== passwordConfirm)
      throw [400, "Password doesn't mathed"];
    req.body = { password: newPassword, newPassword: undefined };
    return next();
  } catch (error) {
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

export { CheckPassword };
