import { Router } from "express";
import { addPopularityOnPost, addPopularityOnProfile, addPopularityOnComment } from "../controllers/popularity.contoller.js";

const router = Router();

router.post("/add-popularity/:postId", addPopularityOnPost);
router.post("/add-popularity/profile/:profileId", addPopularityOnProfile);
router.post("/add-popularity/comment/:commentId", addPopularityOnComment);



export default router;