import dotenv from "dotenv";
import express from "express";
const app = express();
import morgan from "morgan";
import dbConnect from "./config/dbConnect.js";

dotenv.config({
  path: "./.env",
});

dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`server is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("db connection failed ! ", err);
  });

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server running...");
});
