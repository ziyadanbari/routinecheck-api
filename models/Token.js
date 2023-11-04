import { Schema, model } from "mongoose";

const TokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
});

const token = model("whatsappservicetoken", TokenSchema);
export { token };
