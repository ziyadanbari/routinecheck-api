// Modules
import express from "express";
import { ConnectToDB } from "./helpers/mongodb.helper.js";
import fileUpload from "express-fileupload";
import { route as router } from "./routes/routes.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { dailyCronJob } from "./cronjob/dailyCronJob.js";
import { timedCronJob } from "./cronjob/timedCronJob.js";
import jwt from "jsonwebtoken";
// Local Variables
global.parsed = process.env;
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);
global.jwt = jwt;
global.secret_key = parsed.JWT_SECRET_KEY;
const app = express();
console.log(parsed);
// Connect To DB
await ConnectToDB(parsed.DB_URL);
// MiddleWare
app.use(
  cors({
    origin: parsed.CLIENT_DOMAIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(fileUpload());
// Express Session

// CronJobs
dailyCronJob();
timedCronJob();

app.use("/api/v1/", router);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(parsed.PORT || 8000, parsed.INTERFACE_LISTEN, () => {
  console.log(`Server Listening on port ${parsed?.PORT || 8000}`);
});
