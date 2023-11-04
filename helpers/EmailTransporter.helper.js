import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "routine4check@gmail.com",
    pass: "ufin lsfe cwlt ovyj",
  },
});

export { transporter };
