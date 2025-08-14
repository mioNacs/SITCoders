import { Router } from "express";
import isVarifiedByAdmin from "../middlewares/isVarifiedByAdmin.js";
import {
  createComment,
  createReply,
  getParentComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.post("/create/:postId", isVarifiedByAdmin, createComment);
router.post("/reply/:commentId", isVarifiedByAdmin, createReply);
router.post("/get-comments/:postId", getParentComment);

export default router;
