import { Schema, model } from "mongoose";

const EmailVerificationTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

EmailVerificationTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 * 3 }
);
const EmailVerificationToken = model(
  "emailverificationtokens",
  EmailVerificationTokenSchema
);
export { EmailVerificationToken };
