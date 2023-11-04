import { sendEmail } from "../../functions/sendEmail.js";
import crypto from "crypto";
import { EmailVerificationToken } from "../../models/EmailVerificationToken.js";
import { User } from "../../models/User.js";
const generateToken = () => {
  const token = crypto.randomBytes(40).toString("hex");
  return token;
};

const storeToken = async () => {
  const token = generateToken();
  const newEmailVerificationToken = new EmailVerificationToken({ token });
  await newEmailVerificationToken.save();
  return token;
};

const SendEmailVerification = async (req, res) => {
  try {
    const jwtToken = req.headers?.authorization;
    if (!jwtToken) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(jwtToken, secret_key);
    const user = await User.findById(userId).exec();
    const { email, username } = user;
    const token = await storeToken();
    const data = {
      username,
      verificationtoken: `${parsed.CLIENT_DOMAIN}/verifyemail/${token}`,
    };
    await sendEmail(data, email, "emailVerification", "Email Verification");
    res.status(200).json({ message: "Email Sended" });
  } catch (error) {
    console.log(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

export { SendEmailVerification };
