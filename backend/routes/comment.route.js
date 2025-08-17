import { Router } from "express";
import isVarifiedByAdmin from "../middlewares/isVarifiedByAdmin.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import {
  createComment,
  createReply,
  deleteComment,
  getParentComment,
  updateComment,
  adminDeleteComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.post("/create/:postId", isVarifiedByAdmin, createComment);
router.post("/reply/:commentId", isVarifiedByAdmin, createReply);
router.post("/get-comments/:postId", getParentComment);
router.delete("/delete-comment/:commentId", isVarifiedByAdmin, deleteComment);
router.put("/update-comment/:commentId", isVarifiedByAdmin, updateComment);
router.post("/update-comment/:commentId", isVarifiedByAdmin, updateComment); // Fallback for client
router.delete("/admin-delete-comment/:commentId", verifyAdmin, adminDeleteComment);

export default router;
