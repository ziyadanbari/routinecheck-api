import nodemailer from "nodemailer";
import { config } from "dotenv";

const parsed = config().parsed;
const { EMAIL, EMAIL_PASSWORD } = parsed;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export { transporter };
