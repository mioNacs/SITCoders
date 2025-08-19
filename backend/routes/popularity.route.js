import { Router } from "express";
import { addPopularityOnPost, addPopularityOnProfile, addPopularityOnComment, getReputation, leaderBoard } from "../controllers/popularity.contoller.js";

const router = Router();

router.post("/add-popularity/:postId", addPopularityOnPost);
router.post("/add-popularity/profile/:profileId", addPopularityOnProfile);
router.post("/add-popularity/comment/:commentId", addPopularityOnComment);
router.get("/reputation/:userId", getReputation);
router.get("/leaderboard", leaderBoard);

export default router;