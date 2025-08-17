import { Router } from "express";
import { addPopularityOnPost, addPopularityOnProfile } from "../controllers/popularity.contoller.js";

const router = Router();

router.post("/add-popularity/:postId", addPopularityOnPost);
router.post("/add-popularity/profile/:profileId", addPopularityOnProfile);



export default router;