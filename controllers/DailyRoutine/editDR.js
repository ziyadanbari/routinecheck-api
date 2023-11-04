import { DailyRoutine } from "../../models/Daily.js";
import { User } from "../../models/User.js";
import { convertTimeToServerTZ } from "../../functions/convertTimeToServerTZ.js";

const getRoutineId = (routines, title) => {
  for (let routine in routines) {
    if (routines[routine].title === title) {
      return routine;
    }
  }
};

const editDR = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { email } = await User.findById(userId).exec();
    let DR = await DailyRoutine.findOne({ email }).exec();
    const { routine } = DR;
    const { title, newTitle, newDesc, newTime } = req.body;
    const routineId = getRoutineId(DR.routine, title);
    let msTime = DR.routine[routineId].time;

    if (newTime) {
      msTime = await convertTimeToServerTZ(newTime);
    }

    // Update the routine item properties
    DR.routine[routineId].title = newTitle || DR.routine[routineId].title;
    DR.routine[routineId].desc = newDesc || DR.routine[routineId].desc;
    DR.routine[routineId].time = msTime || DR.routine[routineId].time;

    // Save the updated document
    await DR.save();

    res.status(200).json({ routine: DR.routine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export { editDR };
