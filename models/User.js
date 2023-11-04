import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date().toLocaleString(),
  },
  typeOfLogin: {
    type: String,
    default: "email",
  },
  TONS: {
    email: {
      emailNotified: {
        type: String,
        required: false,
      },
      activated: {
        type: String,
        default: false,
      },
    },
    whatsapp: {
      numberNotified: {
        type: String,
        required: false,
      },
      activated: {
        type: String,
        default: false,
      },
    },
  },
});
UserSchema.pre("save", function (next, { skip }) {
  if (!skip) {
    if (this.isVerified && this.email) {
      this.TONS.email = {
        emailNotified: this.email,
        activated: true,
      };
    }
  }
  return next();
});
const User = model("users", UserSchema);
export { User };
