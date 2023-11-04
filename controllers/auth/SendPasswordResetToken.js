import { sendEmail } from "../../functions/sendEmail.js";
import crypto from "crypto";
import { PasswordResetToken } from "../../models/PasswordResetToken.js";
const generateToken = async () => {
  const token = crypto.randomBytes(40).toString("hex");
  return token;
};

const saveToken = async (email) => {
  const token = await generateToken();
  const newToken = new PasswordResetToken({ token, email });
  newToken.save();
  return token;
};

const SendPasswordResetToken = async (req, res) => {
  try {
    const { email, username } = req.DBuser;
    const token = await saveToken(email);
    const data = {
      username,
      verificationtoken: `${parsed.CLIENT_DOMAIN}/resetpassword/${token}`,
    };
    await sendEmail(data, email, "passwordReset", "Password Reset");
    res.status(200).json({
      message:
        "Check your email box we've been you sent an email to reset your password.",
    });
  } catch (error) {
    const isArray = error instanceof Array;
    !isArray && console.log(error);
    const [status, message] = isArray ? error : [500, "internal server error"];
    return res.status(status).json({ message });
  }
};

export { SendPasswordResetToken };
