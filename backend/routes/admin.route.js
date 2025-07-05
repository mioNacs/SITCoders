import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyUser from "../middlewares/verifyUser.js";

import { Router } from "express";

const router = Router();

import {
  createAdmin,
  verifyUserFromAdmin,
  rejectUserFromAdmin,
  getAllUnverifiedUsers,
  isAdmin,
} from "../controllers/admin.controller.js";
router.post("/isAdmin", isAdmin);

// these routes are protected by verifyUser and verifyAdmin middlewares
router.post('/create',verifyUser,verifyAdmin, createAdmin);
router.get('/unverified-users',verifyUser,verifyAdmin, getAllUnverifiedUsers);
router.post('/verify-user', verifyUser, verifyAdmin, verifyUserFromAdmin);
router.post('/reject-user', verifyUser, verifyAdmin, rejectUserFromAdmin);
router.post("/isAdmin",verifyUser,isAdmin)

export default router;
