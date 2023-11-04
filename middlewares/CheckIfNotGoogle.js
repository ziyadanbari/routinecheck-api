import { User } from "../models/User.js";

const CheckIfNotGoogle = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const user = await User.findById(userId);
    if (req.body.email) {
      if (user.typeOfLogin === "google")
        return res
          .status(405)
          .json({ message: "Cannot update email of google account" });
    }
    return next();
  } catch (error) {
    console.log(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server"];
    res.status(status).json({ message });
  }
};
export { CheckIfNotGoogle };
