import { axiosInstance } from "../config/axios/axiosInstance.js";
import { WhatsAppServiceAPI } from "../config/whatsappserviceAPI/API.js";
import { token } from "../models/Token.js";

const sendWhatsappMessage = async ({ phone, message }) => {
  try {
    const { token: AuthorizedToken } = await token.findOne({});
    const response = await axiosInstance.post(
      WhatsAppServiceAPI.sendMessage,
      {
        phone,
        message,
      },
      {
        headers: {
          Authorization: AuthorizedToken,
        },
      }
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export { sendWhatsappMessage };
