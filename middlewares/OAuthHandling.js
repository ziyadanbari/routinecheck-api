import validator from "validator";

const OAuthHandling = async (req, res, next) => {
  try {
    const { username, email, avatar, token } = req.body;
    if (
      username === "" ||
      !username ||
      !email ||
      email === "" ||
      !token ||
      token === ""
    )
      throw [400, "Fields required"];
    else if (!validator.isEmail(email)) throw [400, "Invalid email"];
    else {
      return next();
    }
  } catch (error) {
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

export { OAuthHandling };
