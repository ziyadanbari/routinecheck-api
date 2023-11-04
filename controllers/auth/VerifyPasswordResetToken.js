import bcrypt from "bcrypt";
import { PasswordResetToken } from "../../models/PasswordResetToken.js";
import { User } from "../../models/User.js";

const fetchTokenFromDB = async (token) => {
  const fetchedToken = await PasswordResetToken.findOne({ token });
  if (fetchedToken) return fetchedToken;
  return false;
};

const hashPassword = async (password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
};

const resetPassword = async (newPassword, email, tokenId) => {
  try {
    const user = await User.findOne({ email });
    user.password = await hashPassword(newPassword);
    await user.save();
  } catch (err) {
    console.log(err);
    throw [500, "internal server error"];
  } finally {
    await PasswordResetToken.findByIdAndDelete(tokenId);
  }
};

const VerifyPasswordResetToken = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const { token: tokenFetched, email, _id } = await fetchTokenFromDB(token);
    if (!tokenFetched) throw [403, "Token expired/invalid"];
    else if (tokenFetched && newPassword) {
      resetPassword(newPassword, email, _id);
      return res.status(200).json({ message: "password reset" });
    }
    return res.status(200).json({ message: "Token valid" });
  } catch (error) {
    console.error(error);
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
};

export { VerifyPasswordResetToken };
