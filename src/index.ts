import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";
//
import { onError, normalizePort } from "./helpers";
const path = require("path");
export const port = normalizePort(process.env.PORT || "3000");
// const app = express();
express()
  .use(cors())
  .use(express.json())
  .use(express.static(path.join(__dirname, "public")))
  .use(express.urlencoded({ extended: false }))
  //   @ts-ignore
  .use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  })
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .on("error", onError)
  .get("/", (req, res) => {
    res.render("index");
  })
  .listen(port, () => {
    console.log("Server started on port: ", port);
  });
