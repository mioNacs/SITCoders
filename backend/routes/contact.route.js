import { Router } from "express";
import { sendEmailToAdmin } from "../controllers/contact.controller.js";

const router = Router();

// Protected route - user must be logged in to contact admin
router.post("/send-email", sendEmailToAdmin);

export default router;
