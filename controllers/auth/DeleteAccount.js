import { blackListJwt } from "../../models/BlackListjwt.js";
import { User } from "../../models/User.js";

const insertJWTintoBlacklist = async (token) => {
  try {
    await new blackListJwt({
      token,
    }).save();
    return true;
  } catch (error) {
    throw error;
  }
};

const DeleteAccount = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { userId: _id } = await jwt.verify(token, secret_key);
    await User.findByIdAndDelete(_id);
    await insertJWTintoBlacklist(token);
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    !(error instanceof Array) && console.log(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

export { DeleteAccount };
