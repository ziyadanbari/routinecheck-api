import { Router } from "express";
import {
  EditingFormHandling,
  LoginFormHandling,
  PasswordChangeFormHandling,
  RegisterFormHandling,
  ResetPasswordFormHandling,
  TONTraitFormHandling,
} from "../middlewares/FormHandling.js";
import { HashPassword } from "../middlewares/HashPassword.js";
import { UploadAvatar } from "../middlewares/UploadAvatar.js";
import { CheckUserNotExistence } from "../middlewares/CheckUserNotExistence.js";
import { Register } from "../controllers/auth/Register.js";
import { Login } from "../controllers/auth/Login.js";
import { CheckUserExistence } from "../middlewares/CheckUserExistence.js";
import { checkAuth } from "../middlewares/CheckAuth.js";
import { GetMe } from "../controllers/auth/GetMe.js";
import { RequestTypeChecker } from "../middlewares/RequestTypeChecker.js";
import { OAuthHandling } from "../middlewares/OAuthHandling.js";
import { GoogleAuth } from "../controllers/auth/GoogleAuth.js";
import { addDR } from "../controllers/DailyRoutine/addDR.js";
import { addTR } from "../controllers/TimedRoutine/addTR.js";
import { getDR } from "../controllers/DailyRoutine/getDR.js";
import { Logout } from "../controllers/auth/Logout.js";
import { rmDR } from "../controllers/DailyRoutine/rmDR.js";
import { editDR } from "../controllers/DailyRoutine/editDR.js";
import { completeDR } from "../controllers/DailyRoutine/completeDR.js";
import { rmTR } from "../controllers/TimedRoutine/rmTR.js";
import { getTR } from "../controllers/TimedRoutine/getTR.js";
import { editTR } from "../controllers/TimedRoutine/editTR.js";
import { completeTR } from "../controllers/TimedRoutine/completeTR.js";
import { CheckIfNotGoogle } from "../middlewares/CheckIfNotGoogle.js";
import { EditUser } from "../controllers/auth/EditUser.js";
import { ChangePassword } from "../controllers/auth/ChangePassword.js";
import { CheckPassword } from "../middlewares/CheckPassword.js";
import { VerifyEmail } from "../controllers/auth/VerifyEmail.js";
import { VerifyEmailToken } from "../middlewares/VerifyEmailToken.js";
import { SendEmailVerification } from "../controllers/auth/SendEmailVerification.js";
import { TONtrait } from "../controllers/notification/TONtrait.js";
import { SendPasswordResetToken } from "../controllers/auth/SendPasswordResetToken.js";
import { VerifyPasswordResetToken } from "../controllers/auth/VerifyPasswordResetToken.js";
import { DeleteAccount } from "../controllers/auth/DeleteAccount.js";

const route = Router();

route.post(
  "/register",
  [RegisterFormHandling, HashPassword, CheckUserNotExistence, UploadAvatar],
  Register
);
route.post("/login", [LoginFormHandling, CheckUserExistence], Login);
route.post("/logout", [checkAuth], Logout);
route.post("/google-auth", [RequestTypeChecker, OAuthHandling], GoogleAuth);
route.post(
  "/edituser",
  [
    checkAuth,
    EditingFormHandling,
    CheckUserNotExistence,
    UploadAvatar,
    CheckIfNotGoogle,
  ],
  EditUser
);
route.post(
  "/changepassword",
  [checkAuth, PasswordChangeFormHandling, CheckPassword, HashPassword],
  ChangePassword
);
route.post("/tokenemailverify", [VerifyEmailToken], VerifyEmail);
route.post(
  "/resetpassword",
  [ResetPasswordFormHandling],
  VerifyPasswordResetToken
);
route.post(
  "/sendresetpasswordtoken",
  [CheckUserExistence],
  SendPasswordResetToken
);

route.post("/adddr", [checkAuth], addDR);
route.post("/rmdr", [checkAuth], rmDR);
route.post("/editdr", [checkAuth], editDR);
route.post("/completedr", [checkAuth], completeDR);
route.post("/addtr", [checkAuth], addTR);
route.post("/rmtr", [checkAuth], rmTR);
route.post("/edittr", [checkAuth], editTR);
route.post("/completetr", [checkAuth], completeTR);
route.post("/traitTON", [checkAuth, TONTraitFormHandling], TONtrait);

route.get("/getme", [checkAuth], GetMe);
route.get("/getdr", [checkAuth], getDR);
route.get("/gettr", [checkAuth], getTR);
route.get("/sendemailverification", [checkAuth], SendEmailVerification);
route.get("/deletemyaccount", [checkAuth], DeleteAccount);

export { route };
