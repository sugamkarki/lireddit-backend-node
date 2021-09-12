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
  const { user } = req.body;
  userSchema
    .findOne({ email: user.email })
    .then((_user: any): any => {
      if (!user) {
        return res.status(400).json({ message: "User Not Found" });
      }
      argon2.verify(_user.password, user.password).then((result): any => {
        if (!result) {
          return res.status(401).json({ message: "Invalid Authentication" });
        }
        const token = createToken("1h", { email: _user.email, id: _user.id });
        res.status(201).json({
          token,
          expiresIn: "3600",
          id: _user.id,
        });
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Internal Error" });
    });
});
router.post("/signup", async (req, res, next) => {
  userSchema.findOne({ email: req.body.email }).then((user: any): any => {
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newUser = new userSchema({
      email: req.body.email,
      password: req.body.password,
    });
    // @ts-ignore
    argon2.hash(newUser.password).then((hash) => {
      // @ts-ignore
      newUser.password = hash;
      newUser.save().then((user) => {
        res.status(201).json({
          message: "User Created",
          user,
        });
      });
    });
  });
});
