import { User } from "../../models/User.js";
import { admin } from "../../config/firebase/admin.js";

async function checkUserNotExistence(username, email, avatar, token) {
  try {
    const query = {
      $or: [{ email }, { username }],
    };
    const findUser = await User.findOne(query).exec();
    if (findUser) throw [409, "The user already exists"];
    return saveUser(username, email, avatar, token);
  } catch (error) {
    throw error;
  }
}

async function saveUser(username, email, avatar, token) {
  try {
    const newUser = new User({
      username,
      email,
      avatar,
      typeOfLogin: "google",
      isVerified: true,
    });
    await admin.auth().verifyIdToken(token);
    await newUser.save();
    return newUser._id;
  } catch (error) {
    if (!(error instanceof Array) && error.code === "auth/argument-error")
      throw [401, "Invalid token"];
    throw [500, "Internal server error"];
  }
}

async function checkUserExistence(email, username, token) {
  try {
    const query = {
      $or: [{ username }, { email }],
    };
    const findUser = await User.findOne(query).exec();
    if (!findUser) throw [404, "User not found"];
    return login(findUser, token);
  } catch (error) {
    throw error;
  }
}

async function login(user, token) {
  try {
    const { typeOfLogin, _id } = user;
    if (typeOfLogin !== "google") {
      throw [401, "Credentials incorrect !"];
    }
    await admin.auth().verifyIdToken(token);
    return _id;
  } catch (err) {
    if (err.code === "auth/argument-error") throw [401, "Invalid Token"];
    throw [...err];
  }
}

async function GoogleAuth(req, res) {
  try {
    const form = req.body;
    const { username, email, avatar, token } = form;
    const { type } = req;
    if (!type) throw [500, "Internal server error"];
    else if (type === "register") {
      const Registration = await checkUserNotExistence(
        username,
        email,
        avatar,
        token
      );
      if (Registration) {
        const userId = Registration;
        const token = await jwt.sign({ userId }, secret_key);
        res.status(201).json({ message: "User Created", token });
      }
    } else if (type === "loginose") {
      const Signin = await checkUserExistence(email, username, token);
      if (Signin) {
        const userId = Signin;
        const token = await jwt.sign({ userId }, secret_key);
        res.send({ message: "Welcome !", token });
      }
    } else {
      throw [500, "Invalid type"];
    }
  } catch (error) {
    const [status, message] =
      error instanceof Array ? error : [500, "Internal server error"];
    res.status(status).json({ message });
  }
}
export { GoogleAuth };
