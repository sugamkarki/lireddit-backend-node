import express from "express";
import { router as userRouter } from "./user";
const router = express.Router();

router.get("", (req, res) => {
  res.send(router.stack);
});
router.use("/user", userRouter);

export default router;
