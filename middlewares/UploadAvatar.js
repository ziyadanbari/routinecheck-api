import path from "path";
import crypto from "crypto";
const UploadAvatar = async (req, res, next) => {
  const { DOMAIN } = parsed;
  console.log(__dirname);
  console.log(req.files.avatar.data);
  console.log(req.files.avatar.data.toString("base64"));
  try {
    if (req.files && req.files.avatar) {
      const avatar = req.files.avatar;
      const extension = avatar.mimetype.split("/").slice(-1).join("");
      const fileName = crypto.randomBytes(40).toString("hex");
      const uploadPath = path.join("/tmp", `uploads/${fileName}.${extension}`);
      console.log(uploadPath);
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
