import express from "express";
import { postSchema } from "../../models";
export const router = express.Router();
router.get("", (req, res, next) => {
  postSchema.find({}, (err, posts) => {
    if (err) {
      res.json({ message: "Erros", error: err });
    }
    res.json({ message: "posts fetched", posts });
  });
});
router.post("", (req, res, next) => {
  const postFromRequest = req.body.post;
  const post = new postSchema({
    title: postFromRequest.title,
    content: postFromRequest.content,
    creator: postFromRequest.creator,
  });
  //   @ts-ignore
  post.save().then((post, err): any => {
    if (err) {
      return res.json({ message: "Error", error: err });
    }
    res.json({ message: "Post created", post });
  });
});
