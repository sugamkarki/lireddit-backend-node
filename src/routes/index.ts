import express from "express";
import { router as userRouter } from "./user";
import { router as postRouter } from "./post";
const router = express.Router();

router.get("", (req, res) => {
  res.send(router.stack);
});
router.use("/user", userRouter);
router.use("/post", postRouter);

export default router;
