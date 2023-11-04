import { convertTimeToServerTZ } from "../../functions/convertTimeToServerTZ.js";
import { DailyRoutine } from "../../models/Daily.js";
import { User } from "../../models/User.js";

const addDR = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const findEmail = await User.findById(userId).exec();
    const { email } = findEmail;
    const { routine } = req.body;
    const msTime = await convertTimeToServerTZ(routine.time);
    const newRoutine = { ...routine, time: msTime };
    const userDailyRoutine = await DailyRoutine.findOne({ email }).exec();
    if (userDailyRoutine) {
      if (Boolean(userDailyRoutine.routine.length)) {
        const isExist = userDailyRoutine.routine.filter(
          (e) => e.title.toLowerCase() === newRoutine.title.toLowerCase()
        );
        if (!Boolean(isExist.length)) {
          userDailyRoutine.routine = [...userDailyRoutine.routine, newRoutine];
          await userDailyRoutine.save();
          return res.status(200).json({ routine: userDailyRoutine.routine });
        } else {
          return res.status(409).json({ message: "Routine Already Exist" });
        }
      } else {
        userDailyRoutine.routine = [newRoutine];
        userDailyRoutine.save();
        return res.status(200).json({ routine: [...userDailyRoutine.routine] });
      }
    } else {
      const newDailyRoutine = new DailyRoutine({
        email,
        routine: [newRoutine],
      });
      await newDailyRoutine.save();
      return res.status(200).json({ routine: [...newDailyRoutine.routine] });
    }
  } catch (err) {
    console.log(err);
    const [status, message] = Array.isArray(err)
      ? err
      : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};
export { addDR };
