import express from "express";
import cors from "cors";
//
import { onError, normalizePort, connectToMongoose } from "./helpers";
import router from "./routes";
//
const path = require("path");
require("dotenv-safe").config({});
export const port = normalizePort(process.env.PORT || "3000");
connectToMongoose();
express()
  .use(
    cors({
      origin: process.env.CORS,
    })
  )
  .use(express.json())
  .use(express.static(path.join(__dirname, "public")))
  .use(express.urlencoded({ extended: false }))
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
