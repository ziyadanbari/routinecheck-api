import { DailyRoutine } from "../../models/Daily.js";
import { User } from "../../models/User.js";

const rmDR = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { email } = await User.findById(userId).exec();
    const { title } = req.body;
    const DR = await DailyRoutine.findOne({ email });
    DR.routine.forEach((e, i) => {
      if (e.title === title) {
        DR.routine.splice(i, 1);
      }
    });
    await DR.save();
    res.status(200).json({ routine: DR.routine });
  } catch (err) {
    const [status, message] =
      err instanceof Array ? err : [500, "Internal server"];
    res.status(status).json({ message });
  }
};

export { rmDR };
