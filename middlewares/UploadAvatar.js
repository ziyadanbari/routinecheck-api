import path from "path";
import crypto from "crypto";
import { config } from "dotenv";
import { fileURLToPath } from "url";

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
const UploadAvatar = async (req, res, next) => {
  const {
    parsed: { DOMAIN },
  } = config();
  try {
    if (req.files && req.files.avatar) {
      const avatar = req.files.avatar;
      const extension = avatar.mimetype.split("/").slice(-1).join("");
      const fileName = crypto.randomBytes(40).toString("hex");
      const uploadPath = path.join(
        __dirname,
        `../uploads/${fileName}.${extension}`
      );
      await avatar.mv(uploadPath, (err) => {
        if (err) throw [500, "Cannot upload the image"];
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
