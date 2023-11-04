import bcrypt from "bcrypt";

const HashPassword = async (req, res, next) => {
  try {
    const form = req.body;
    const { password } = form;
    bcrypt.hash(password, 10, (err, hash) => {
      if (err || !hash) throw [500, err];
      else {
        req.body = { ...form, password: hash };
        return next();
      }
    });
  } catch ([status, message]) {
    res.status(status).json({ message });
  }
};

export { HashPassword };
