import axios from "axios";
import { WhatsAppServiceAPI } from "../whatsappserviceAPI/API.js";

const axiosInstance = axios.create({
  baseURL: WhatsAppServiceAPI.baseURL,
});

export { axiosInstance };
