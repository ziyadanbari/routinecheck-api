import { User } from "../../models/User.js";

const GetMe = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { userId: _id } = await jwt.verify(token, secret_key);
    const findUser = await User.findById(_id);
    if (findUser)
      return res.status(200).json({
        data: {
          ...findUser._doc,
          password: undefined,
          _id: undefined,
          __v: undefined,
        },
      });
    else throw [404, "User Not Found or Invalid Session"];
  } catch (error) {
    console.log(!(error instanceof Array) ? error : "");
    const [status, message] =
      error instanceof Array ? error : [500, "internal server error"];
    return res.status(status).json({ message });
  }
};
export { GetMe };
