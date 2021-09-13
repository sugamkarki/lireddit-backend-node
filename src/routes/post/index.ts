import express from "express";
import multer from "multer";
import { postSchema, userSchema } from "../../models";
import { storage } from "../../middlewares";
import { jwtVerify as checkAuth } from "../../middlewares";
export const router = express.Router();
router.get("", (req, res, next) => {
  postSchema
    .find()
    .sort({ createdAt: -1 })
    .populate({
      path: "creator",
      select: ["first_name", "last_name", "email", "profile_picture"],
    })
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.json({ message: "Posts fetched", posts });
    });
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req: any, res, next) => {
    // console.log(req.userData);
    const url = req.protocol + "://" + req.get("host");
    const postFromRequest = req.body;
    // console.log(req.file);
    const post = new postSchema({
      title: postFromRequest.title,
      content: postFromRequest.content,
      creator: req.userData.userId,
      imagePath: url + "/images/post/" + req.file.filename,
    });
    //   @ts-ignore
    post.save().then((post, err): any => {
      if (err) {
        return res.json({ message: "Error", error: err });
      }
      postSchema
        .find()
        .sort({ createdAt: -1 })
        .populate({
          path: "creator",
          select: ["first_name", "last_name", "email", "profile_picture"],
        })
        .exec((err, posts) => {
          if (err) {
            return res.status(400).json({
              error: err,
            });
          }
          return res.json({ message: "Posts fetched", posts });
        });
    });
  }
);
router.delete("/:id", checkAuth, (req, res) => {
  postSchema
    .deleteOne(
      // @ts-ignore
      { _id: req.params.id, creator: req.userData.userId }
    )
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Deleted" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    })
    // @ts-ignore
    .catch((err) => {
      res.status(404).json({ message: "not found" });
    });
});
router.get("/:id", (req, res) => {
  console.log(req.params.id);
  postSchema
    // @ts-ignore
    .findById(req.params.id, (err, post) => {
      res.status(201).json({ message: "post fetched", post });
    });
});
router.patch("/:id", checkAuth, (req, res) => {
  // @ts-ignore
  console.log(req.userData.userId);
  postSchema
    // @ts-ignore
    .updateOne(
      // @ts-ignore
      { _id: req.params.id, creator: req.userData.userId },
      {
        title: req.body.title,
        content: req.body.content,
      }
    )
    .then((result) => {
      console.log(result);
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "updated" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    });
});
