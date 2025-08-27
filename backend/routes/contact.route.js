import { Router } from "express";
import { getAllAdmins, sendEmailToAdmin } from "../controllers/contact.controller.js";

const router = Router();

// Protected route - user must be logged in to contact admin
router.post("/send-email", sendEmailToAdmin);
router.get("/all-admins", getAllAdmins);

export default router;
