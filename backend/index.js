import app from "./app.js";
import { connectDB } from "./src/DB/index.js";

import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(8000 || process.env.PORT, () => {
      console.log(`App is listening at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed ::", err);
    process.exit(1);
  });
