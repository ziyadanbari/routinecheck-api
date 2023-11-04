import bcrypt from "bcrypt";

const Login = async (req, res) => {
  try {
    const form = req.body;
    const DBuser = req.DBuser;
    const { password } = form;
    const { password: hashedPassword } = DBuser;
    const succ = bcrypt.compareSync(password, hashedPassword);
    if (!succ) throw [403, "Password Incorrect"];
    const token = await jwt.sign({ userId: req.DBuser._id }, secret_key);
    return res.status(200).json({ message: "Welcome !", token });
  } catch (error) {
    const [status, message] =
      error instanceof Array
        ? [403, "Password Incorrect"]
        : [500, "Internal server error"];
    return res.status(status).json({ message });
  }
};

export { Login };
