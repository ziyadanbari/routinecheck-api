import { blackListJwt } from "../models/BlackListjwt.js";

const notInBlackList = async (token) => {
  const fetchedToken = await blackListJwt.findOne({ token }).exec();
  if (fetchedToken) return false;
  return true;
};

const checkAuth = async (req, res, next) => {
  try {
    if (!req.headers?.authorization) throw [401, "You are not registered"];
    const token = req.headers.authorization;
    const isNotInBlackList = await notInBlackList(token);
    if (!isNotInBlackList) throw [401, "You are not registered"];
    const { userId } = await jwt.verify(token, secret_key);
    if (!userId) throw [401, "You are not registered"];
    return next();
  } catch (error) {
    console.log(!(error instanceof Array) ? error : "");
    const [status, message] =
      error instanceof Array ? error : [500, "internal server error"];
    return res.status(status).json({ message });
  }
};

export { checkAuth };
