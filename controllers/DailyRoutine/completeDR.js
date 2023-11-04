import { DailyRoutine } from "../../models/Daily.js";
import { User } from "../../models/User.js";

const findTargetRoutine = (routines, title) => {
  let index;
  routines.forEach((e, i) => {
    if (e.title === title) {
      index = i;
    }
  });
  return index;
};

const completeDR = async (req, res) => {
  try {
    const { title, action } = req.body;
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { email } = await User.findById(userId).exec();
    const DR = await DailyRoutine.findOne({ email });
    const routineIndex = findTargetRoutine(DR.routine, title);
    if (typeof JSON.parse(action) === "boolean") {
      DR.routine[routineIndex].completed = action;
      await DR.save();
      return res.status(200).json({ routine: DR.routine });
    } else {
      throw [400, "Invalid action type"];
    }
  } catch (error) {
    console.log(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};
export { completeDR };
