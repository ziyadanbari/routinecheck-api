import { Schema, model } from "mongoose";

const TimedRoutineSchema = new Schema({
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
const TimedRoutine = model("timed", TimedRoutineSchema);
export { TimedRoutine };
