import admin from "firebase-admin";
import serviceAccount from "./adminsdk.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export { admin };
