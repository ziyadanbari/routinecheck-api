import { axiosInstance } from "../config/axios/axiosInstance.js";
import { WhatsAppService } from "../config/whatsappserviceAPI/API.js";
import { token } from "../models/Token.js";

const sendMessage = async (phone, message) => {
  try {
    const authorizedToken = await token.find({});
    const data = { phone, message };
    const response = await axiosInstance.post(
      WhatsAppService.sendMessage,
      phone
    );
  } catch (error) {
    console.log(error);
  }
};
export { sendMessage };
