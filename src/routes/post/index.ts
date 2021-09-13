import express from "express";
import multer from "multer";
import { postSchema } from "../../models";
import { storage } from "../../middlewares";
import { jwtVerify as checkAuth } from "../../middlewares";
export const router = express.Router();
//
// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpg",
//   "image/jpg": "jpg",
// };

// export const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("Invalid mime type");
//     console.log(file.mimetype);
//     if (isValid) {
//       // @ts-ignore
//       error = null;
//     }
//     cb(error, "public/images");
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname.toLowerCase().split(" ").join("-");
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     console.log(name, ext);
//     cb(null, name + "-" + Date.now() + "." + ext);
//   },
// });

//
router.get("", (req, res, next) => {
  postSchema.find({}, (err, posts) => {
    if (err) {
      res.json({ message: "Erros", error: err });
    }
    res.json({ message: "posts fetched", posts });
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
      res.json({ message: "Post created", post });
    });
  }
);
