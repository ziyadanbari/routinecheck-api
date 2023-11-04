import mongoose from "mongoose";

async function ConnectToDB(dbUrl) {
  try {
    await mongoose.connect(dbUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
}

export { ConnectToDB };
