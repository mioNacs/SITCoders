import { Router } from "express";
import isVarifiedByAdmin from "../middlewares/isVarifiedByAdmin.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import Comment from "../models/comment.model.js";
import {
  createComment,
  createReply,
  deleteComment,
  getParentComment,
  updateComment,
  adminDeleteComment,
} from "../controllers/comment.controller.js";

const router = Router();

// This is the route i used to delete all the comments 
// router.get("/delete-comment",async(req,res) => {
//   await Comment.deleteMany({});
//   res.send("All comments deleted");
// })

router.post("/create/:postId", isVarifiedByAdmin, createComment);
router.post("/reply/:commentId", isVarifiedByAdmin, createReply);
router.post("/get-comments/:postId", getParentComment);
router.delete("/delete-comment/:commentId", isVarifiedByAdmin, deleteComment);
router.post("/update-comment/:commentId", isVarifiedByAdmin, updateComment); // Fallback for client
router.delete("/admin-delete-comment/:commentId", verifyAdmin, adminDeleteComment);

export default router;
