import * as fs from "fs";
import handlebars from "handlebars";
import { transporter } from "../helpers/EmailTransporter.helper.js";
import path from "path";

const EMAIL = "routine4check@gmail.com";

function handleHtmlTemplate(htmlTemplate, data) {
  const templateSource = fs.readFileSync(
    path.resolve(`./views/${htmlTemplate}.html`),
    "utf-8"
  );
  const template = handlebars.compile(templateSource);
  const html = template(data);
  return html;
}

const sendEmail = async (data, email, htmlTemplate, subject) => {
  const html = handleHtmlTemplate(htmlTemplate, data);
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

export { sendEmail };
