import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
const UploadAvatar = async (req, res, next) => {
  const { DOMAIN } = process.env;
  try {
    if (req.files && req.files.avatar) {
      const avatar = req.files.avatar;
      const extension = avatar.mimetype.split("/").slice(-1).join("");
      const fileName = crypto.randomBytes(40).toString("hex");
      const uploadPath =
        process.env.NODE_ENV === "production"
          ? path.join(__dirname, `../uploads/${fileName}.${extension}`)
          : `/tmp/uploads/${fileName}.${extension}`;
      await avatar.mv(uploadPath, (err) => {
        console.log(err);
        if (err) throw [500, uploadPath];
      });
      const URLpath = `${DOMAIN}uploads/${fileName}.${extension}`;
      req.body = {
        ...req.body,
        avatar: URLpath,
      };
      return next();
    } else {
      return next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "test" });
    return next();
  }
};

export { UploadAvatar };
