import { TimedRoutine } from "../../models/Timed.js";
import { User } from "../../models/User.js";

const getTR = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { email } = await User.findById(userId);
    const TR = await TimedRoutine.findOne({ email }).exec();
    if (TR && Boolean(TR.routine.length)) {
      res.status(200).json({ routine: [...TR.routine] });
    } else {
      throw [404, "No Routine Found"];
    }
  } catch (error) {
    console.log(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};
export { getTR };
