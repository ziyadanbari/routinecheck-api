import { blackListJwt } from "../../models/BlackListjwt.js";

const Logout = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw ["you are not registred"];
    await new blackListJwt({
      token,
    }).save();
    res.status(200).json({ message: "Good Bye !" });
  } catch (error) {
    const [status, message] = Array.isArray(error)
      ? error
      : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};
export { Logout };
