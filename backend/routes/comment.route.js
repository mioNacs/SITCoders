import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.js";
import isVarifiedByAdmin from "../middlewares/isVarifiedByAdmin.js";
import {
  createComment,
  createReply,
  getParentComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.post("/create/:postId", verifyUser, isVarifiedByAdmin, createComment);
router.post("/reply/:commentId", verifyUser, isVarifiedByAdmin, createReply);
router.post(
  "/get-comments/:postId",
  verifyUser,
  getParentComment
);

export default router;
