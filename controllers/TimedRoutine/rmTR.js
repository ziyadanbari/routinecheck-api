import { TimedRoutine } from "../../models/Timed.js";
import { User } from "../../models/User.js";

const rmTR = async (req, res) => {
  try {
    const { _id } = req.body;
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { email } = await User.findById(userId);
    await TimedRoutine.findOneAndUpdate(
      { email },
      {
        $pull: { routine: { _id } },
      }
    );
    const TR = await TimedRoutine.findOne({ email }).exec();
    return res.status(200).json({ routine: [...TR.routine] });
  } catch (error) {
    console.log(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};
export { rmTR };
