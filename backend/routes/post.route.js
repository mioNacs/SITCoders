import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.js";
import isVarifiedByAdmin from "../middlewares/isVarifiedByAdmin.js";
import { createPost } from "../controllers/post.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/create",
  verifyUser,
  isVarifiedByAdmin,
  upload.single("postImage"),
  createPost
);

export default router;
