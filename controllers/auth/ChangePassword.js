import bcrypt from "bcrypt";
import { User } from "../../models/User.js";

const ChangePassword = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { password } = req.body;
    const user = await User.findById(userId);
    user.password = password;
    await user.save();
    return res.status(200).json({ message: "Password Changed" });
  } catch (error) {
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server"];
    res.status(status).json({ message });
  }
};
export { ChangePassword };
