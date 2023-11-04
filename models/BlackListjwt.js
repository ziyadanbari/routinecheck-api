import { Schema, model } from "mongoose";

const blackListJwtSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
});

const blackListJwt = model("blacklistjwt", blackListJwtSchema);
export { blackListJwt };
