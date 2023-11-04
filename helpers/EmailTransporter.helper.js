import nodemailer from "nodemailer";
const { EMAIL, EMAIL_PASSWORD } = process.env;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export { transporter };
