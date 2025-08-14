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

router.delete("/delete/:postId", verifyUser, isVarifiedByAdmin, deletePost);

router.put("/edit/:postId", verifyUser, isVarifiedByAdmin, editPost);

router.get("/get-posts", verifyUser, getALLPosts);
router.get("/get-user-posts", verifyUser, getALLPostsOfUser);
router.get("/user/:userId", verifyUser, getPostsByUserId);
router.get("/:postId", verifyUser, getPostById);

export default router;
