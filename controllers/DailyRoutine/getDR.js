import { DailyRoutine } from "../../models/Daily.js";
import { User } from "../../models/User.js";

const getDR = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { email } = await User.findById(userId).exec();
    const DR = await DailyRoutine.findOne({ email }).exec();
    if (!DR) throw [404, "You don't have a daily routine"];
    return res.status(200).json({ routine: DR.routine });
  } catch (error) {
    const [status, message] = Array.isArray(error)
      ? error
      : [500, "internal server error"];
    res.status(status).json({ message });
  }
};
export { getDR };
