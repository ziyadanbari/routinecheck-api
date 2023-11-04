import { Schema, model } from "mongoose";

const DailyRoutineSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  routine: [
    {
      title: String,
      desc: String,
      time: Number,
      passed: {
        type: Boolean,
        default: false,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      isDeclared: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
const DailyRoutine = model("daily", DailyRoutineSchema);
export { DailyRoutine };
