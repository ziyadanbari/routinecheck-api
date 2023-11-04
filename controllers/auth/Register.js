import { User } from "../../models/User.js";

const Register = async (req, res) => {
  try {
    const form = req.body;
    const newUser = new User({ ...form });
    await newUser.save();
    const token = await jwt.sign({ userId: newUser._id }, secret_key);
    return res.status(200).json({
      message: "User Created",
      token,
    });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

export { Register };
