import { TimedRoutine } from "../../models/Timed.js";
import { User } from "../../models/User.js";

const completeTR = async (req, res) => {
  try {
    const { _id, action } = req.body;
    if (_id === "" || action === "") throw [400, "Fields Required"];
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { email } = await User.findById(userId);
    const TR = await TimedRoutine.findOne({ email });
    const routineIndex = TR.routine.findIndex((e) => e._id.toString() === _id);
    if (routineIndex === -1) throw [404, "Routine not found"];
    if (typeof JSON.parse(action) === "boolean") {
      TR.routine[routineIndex].completed = action;
      await TR.save();
      return res.status(200).json({ routine: [...TR.routine] });
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
export { completeTR };
