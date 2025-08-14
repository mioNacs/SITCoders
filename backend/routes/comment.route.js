import { Router } from "express";
import isVarifiedByAdmin from "../middlewares/isVarifiedByAdmin.js";
import {
  createComment,
  createReply,
  deleteComment,
  getParentComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.post("/create/:postId", isVarifiedByAdmin, createComment);
router.post("/reply/:commentId", isVarifiedByAdmin, createReply);
router.post("/get-comments/:postId", getParentComment);
router.delete("/delete-comment/:commentId", isVarifiedByAdmin, deleteComment);

export default router;
