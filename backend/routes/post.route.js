import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.js";
import isVarifiedByAdmin from "../middlewares/isVarifiedByAdmin.js";
import {
  createPost,
  deletePost,
  getALLPosts,
  getALLPostsOfUser,
  editPost,
  getPostsByUserId,
  getPostById,
} from "../controllers/post.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/create",
  isVarifiedByAdmin,
  upload.single("postImage"),
  createPost
);

router.delete("/delete/:postId", isVarifiedByAdmin, deletePost);

router.put("/edit/:postId", isVarifiedByAdmin, editPost);

router.get("/get-posts", getALLPosts);
router.get("/get-user-posts", getALLPostsOfUser);
router.get("/user/:userId", getPostsByUserId);
router.get("/:postId", getPostById);

export default router;
