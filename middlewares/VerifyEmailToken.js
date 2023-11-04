import { EmailVerificationToken } from "../models/EmailVerificationToken.js";

const VerifyEmailToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    const tokens = await EmailVerificationToken.findOne({ token }).exec();
    if (!tokens) throw [403, "The token expired/inavailable"];
    return next();
  } catch (error) {
    console.log(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};
export { VerifyEmailToken };
