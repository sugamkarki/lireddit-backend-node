import express from "express";
import cors from "cors";
//
import { onError, normalizePort, connectToMongoose } from "./helpers";
import router from "./routes";
//
const path = require("path");
// require("dotenv-safe").config({
//   allowEmptyValues: true,
// });
const dotenv = require("dotenv");
const result = dotenv.config();

if (result.error) {
  if (process.env.NODE_ENV === "production" && result.error.code === "ENOENT") {
    console.info(
      "expected this error because we are in production without a .env file"
    );
  } else {
    throw result.error;
  }
}
export const port = normalizePort(process.env.PORT || "3000");
connectToMongoose();
express()
  .use(
    cors({
      origin: process.env.CORS_DEV,
    })
  )

  .use(express.static(path.join(__dirname, "public")))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  //   @ts-ignore
  .use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
  })
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .on("error", onError)
  //   @ts-ignore
  .get("/", (req, res) => {
    res.render("index");
  })
  .use("/api", router)
  .listen(port, () => {
    console.log("Server started on port: ", port);
  });
