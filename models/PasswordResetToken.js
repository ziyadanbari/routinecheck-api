import { Schema, model } from "mongoose";

const PasswordResetTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

PasswordResetTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 * 3 }
);
const PasswordResetToken = model(
  "passwordresettokens",
  PasswordResetTokenSchema
);
export { PasswordResetToken };
