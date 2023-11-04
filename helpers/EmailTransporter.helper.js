import nodemailer from "nodemailer";
const { EMAIL, EMAIL_PASSWORD } = parsed;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export { transporter };
