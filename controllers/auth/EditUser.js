import { User } from "../../models/User.js";

const EditUser = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw [403, "You are not authorized"];
    const { userId } = await jwt.verify(token, secret_key);
    const { username, email, avatar } = req.body;
    if (!username && !email && !avatar) {
      return res.status(400).json({ message: "Really you change nothing" });
    }
    const updateFields = {};
    if (email !== undefined) {
      updateFields.email = email;
    }
    if (username !== undefined) {
      updateFields.username = username;
    }
    if (avatar !== undefined) {
      updateFields.avatar = avatar;
    }

    await User.findByIdAndUpdate(userId, updateFields);
    const findUser = await User.findById(userId);
    return res.status(200).json({
      data: {
        ...findUser._doc,
        password: undefined,
        _id: undefined,
        __v: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};
export { EditUser };
