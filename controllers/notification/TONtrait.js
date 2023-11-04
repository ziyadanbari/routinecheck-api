import { User } from "../../models/User.js";
import validator from "validator";

const TONtrait = async (req, res) => {
  try {
    const { option, active, notified } = req.body;
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const user = await User.findById(userId);
    const { TONS } = user;

    if (option === "email") {
      if (!user.isVerified) {
        throw [
          400,
          "You can't enable this feature without verifying your email",
        ];
      } else {
        const emailOption = TONS.email;
        user.TONS.email = {
          emailNotified: notified || emailOption.emailNotified,
          activated: active || emailOption.activated,
        };
      }
    } else if (option === "whatsapp") {
      const whatsappOption = TONS.whatsapp;
      if (!whatsappOption.numberNotified && JSON.parse(active)) {
        throw [400, "You can't activate the feature without a phone number"];
      } else {
        user.TONS.whatsapp = {
          numberNotified: notified || whatsappOption.numberNotified,
          activated: active || whatsappOption.activated,
        };
      }
    }
    await user.save({ skip: true });
    res.status(200).json({
      TONS: { ...user._doc.TONS },
    });
  } catch (error) {
    console.error(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

export { TONtrait };
