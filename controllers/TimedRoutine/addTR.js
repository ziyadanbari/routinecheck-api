import { convertDateToServerTZ } from "../../functions/convertDateToServerTZ.js";
import { TimedRoutine } from "../../models/Timed.js";
import { User } from "../../models/User.js";

const checkIfTimeAlreadyUsed = async (ms, email, TimedRoutine) => {
  try {
    TimedRoutine.routine.forEach((e, i, a) => {
      if (e.time === ms) throw [409, "Time already used"];
    });
    return false;
  } catch (error) {
    throw error;
  }
};

const addTR = async (req, res) => {
  try {
    const { routine } = req.body;
    const { title, desc, time } = routine;
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { email } = await User.findById(userId).exec();
    const msTime = await convertDateToServerTZ(time);
    const timedRoutine = await TimedRoutine.findOne({ email });
    const newRoutine = { title, desc, time: msTime };
    if (timedRoutine) {
      if (Boolean(timedRoutine.routine.length)) {
        const timeIsExist = await checkIfTimeAlreadyUsed(
          msTime,
          email,
          timedRoutine
        );
        if (!timeIsExist) {
          timedRoutine.routine = [...timedRoutine.routine, newRoutine];
          await timedRoutine.save();
          res.status(200).json({ routine: [...timedRoutine.routine] });
        }
      } else {
        timedRoutine.routine = [newRoutine];
        await timedRoutine.save();
        res.status(200).json({ routine: [...timedRoutine.routine] });
      }
    } else {
      const newTimedRoutine = new TimedRoutine({
        email,
        routine: [newRoutine],
      });
      await newTimedRoutine.save();
      res.status(200).json({ routine: [...newTimedRoutine.routine] });
    }
  } catch (err) {
    console.log(err);
    const [status, message] =
      err instanceof Array ? err : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};
export { addTR };
