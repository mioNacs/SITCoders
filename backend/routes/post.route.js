import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.js";
import isVarifiedByAdmin from "../middlewares/isVarifiedByAdmin.js";
import { createPost, deletePost, getALLPosts, getALLPostsOfUser } from "../controllers/post.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/create",
  verifyUser,
  isVarifiedByAdmin,
  upload.single("postImage"),
  createPost
);

router.delete("/delete/:postId", verifyUser, isVarifiedByAdmin, deletePost);

router.get("/get-posts", verifyUser, getALLPosts);
router.get("/get-user-posts", verifyUser, getALLPostsOfUser);

export default router;
