import nodemailer from "nodemailer";
import { config } from "dotenv";
const { EMAIL, EMAIL_PASSWORD } = config().parsed;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export { transporter };
