import { User } from "../../models/User.js";

const VerifyEmail = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const user = await User.findById(userId).exec();
    user.isVerified = true;
    user.save();
    res.status(200).json({ message: "Email Verified" });
  } catch (error) {
    console.log(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

export { VerifyEmail };
