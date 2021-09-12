import argon2 from "argon2";
import express from "express";
//
import { userSchema } from "../../models";
import * as interfaces from "../../interfaces";
import { createToken } from "../..//helpers";
export const router = express.Router();

router.get("", (req, res) => {
  userSchema.find().then((users) => {
    res.json({ message: "users fetched", users });
  });
});
router.get("/:id", (req, res) => {});

router.post("/login", (req, res, next) => {
  userSchema
    .findOne({ email: req.body.email })
    .then((user: any): any => {
      if (!user) {
        return res.status(400).json({ message: "User Not Found" });
      }
      argon2.verify(user.password, req.body.password).then((result): any => {
        if (!result) {
          return res.status(401).json({ message: "Invalid Authentication" });
        }
        console.log(user.id);
        const token = createToken("1h", { email: user.email, id: user.id });
        res.status(201).json({
          token,
          expiresIn: "3600",
          id: user.id,
        });
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Internal Error" });
    });
});
router.post("/signup", async (req, res, next) => {
  const user = new userSchema({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: await argon2.hash(req.body.password),
    profile_picture: "",
  });
  user.save().then((_user) => {
    res.status(201).json({ message: "User Created Successfully", user: _user });
  });
});
