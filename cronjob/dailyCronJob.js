import { sendEmail } from "../functions/sendEmail.js";
import { sendWhatsappMessage } from "../helpers/sendWhatsappMessage.js";
import { DailyRoutine } from "../models/Daily.js";
import { User } from "../models/User.js";

const getMsOfDate = () => {
  const date = new Date();
  const ms =
    date.getHours() * 60 * 60 * 1000 +
    date.getMinutes() * 60 * 1000 +
    date.getSeconds() * 1000;
  return ms;
};

const dailyCronJob = async () => {
  setInterval(async () => {
    try {
      const dailyRoutines = await DailyRoutine.find({});
      for (const dailyRoutine of dailyRoutines) {
        for (const e of dailyRoutine.routine) {
          const ms = getMsOfDate();
          const { time } = e;
          if (ms >= time) {
            e.passed = true;
            if (!e.isDeclared) {
              const { isVerified, TONS } = await User.findOne({
                email: dailyRoutine.email,
              });
              if (isVerified && TONS.email.activated) {
                const data = {
                  title: e.title,
                  description: e.desc,
                };
                await sendEmail(
                  data,
                  dailyRoutine.email,
                  "timedCronTemplate",
                  "Timed Routine declare"
                );
                e.isDeclared = true;
              }
              if (TONS.whatsapp.numberNotified && TONS.whatsapp.activated) {
                const data = {
                  phone: TONS.whatsapp.numberNotified,
                  message: `This is the time for: "${e.title}"\nDescription: ${e.desc}\nWhen you finish your task don't forget to check it in your dashboard`,
                };
                await sendWhatsappMessage(data);
                e.isDeclared = true;
              }
            }
            await dailyRoutine.save();
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, 5000);
};
export { dailyCronJob };
