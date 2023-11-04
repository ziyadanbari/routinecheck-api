import { convertDateToServerTZ } from "../../functions/convertDateToServerTZ.js";
import { TimedRoutine } from "../../models/Timed.js";
import { User } from "../../models/User.js";

const editTR = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { _id, newTitle, newDesc, newTime } = req.body;
    const { email } = await User.findById(userId).exec();
    const msTime = await convertDateToServerTZ(newTime);
    const TR = await TimedRoutine.findOne({ email }).exec();
    const routineIndex = TR.routine.findIndex((e) => {
      return e._id.toString() === _id;
    });
    if (routineIndex === -1) throw [404, "Routine not found"];
    const { title, desc, time } = TR.routine[routineIndex];
    TR.routine[routineIndex].title = newTitle || title;
    TR.routine[routineIndex].desc = newDesc || desc;
    TR.routine[routineIndex].time = msTime || time;
    TR.save();
    res.status(200).json({ routine: [...TR.routine] });
  } catch (error) {
    console.log(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};
export { editTR };
