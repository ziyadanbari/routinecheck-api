import { sendEmail } from "../functions/sendEmail.js";
import { sendWhatsappMessage } from "../helpers/sendWhatsappMessage.js";
import { TimedRoutine } from "../models/Timed.js";
import { User } from "../models/User.js";

const timedCronJob = async () => {
  setInterval(async () => {
    const TR = await TimedRoutine.find({});
    const now = new Date().getTime();
    for (const timedRoutine of TR) {
      for (const e of timedRoutine.routine) {
        if (now >= e.time) {
          e.passed = true;
          if (!e.isDeclared) {
            const { isVerified, TONS } = await User.findOne({
              email: timedRoutine.email,
            });
            if (isVerified && TONS.email.activated) {
              const data = {
                title: e.title,
                description: e.desc,
              };
              await sendEmail(
                data,
                timedRoutine.email,
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
          await timedRoutine.save();
        }
      }
    }
  }, 5000);
};

export { timedCronJob };
