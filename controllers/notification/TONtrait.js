import { User } from "../../models/User.js";

const TONtrait = async (req, res) => {
  try {
    const { options } = req.body;
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const user = await User.findById(userId);
    const { TONS } = user;
    options.map(({ title, activated, notified }) => {
      if (title === "email") {
        if (!user.isVerified && JSON.parse(activated)) {
          throw [
            400,
            "You can't enable this feature without verifying your email",
          ];
        } else {
          const emailOption = TONS.email;
          user.TONS.email = {
            emailNotified: notified || emailOption.emailNotified,
            activated: activated || emailOption.activated,
          };
        }
      } else if (title === "whatsapp") {
        const whatsappOption = TONS.whatsapp;
        if (!whatsappOption.numberNotified && JSON.parse(activated)) {
          throw [400, "You can't activate the feature without a phone number"];
        } else {
          user.TONS.whatsapp = {
            numberNotified: notified || whatsappOption.numberNotified,
            activated: activated || whatsappOption.activated,
          };
        }
      }
    });
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
