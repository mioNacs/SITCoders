import { Router } from "express";
import { addPopularityOnPost } from "../controllers/popularity.contoller.js";

const router = Router();

router.post("/add-popularity/:postId", addPopularityOnPost);



export default router;