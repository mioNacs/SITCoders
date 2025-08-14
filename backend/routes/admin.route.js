import verifyAdmin from "../middlewares/verifyAdmin.js";

import { Router } from "express";

const router = Router();

import {
  createAdmin,
  verifyUserFromAdmin,
  rejectUserFromAdmin,
  getAllUnverifiedUsers,
  isAdmin,
  getVerifiedUser,
  removeFromAdmin,
  suspendAccount,
} from "../controllers/admin.controller.js";
import verifySuperAdmin from "../middlewares/verifySuperAdmin.js";


router.post("/isAdmin", isAdmin);



// these routes are protected by verifyUser and verifyAdmin middlewares

router.post("/suspend-account", verifyAdmin, suspendAccount);
router.post("/create", verifyAdmin, createAdmin);
router.get("/unverified-users", verifyAdmin, getAllUnverifiedUsers);
router.post("/verify-user", verifyAdmin, verifyUserFromAdmin);
router.post("/reject-user", verifyAdmin, rejectUserFromAdmin);
router.get("/get-verified-user", verifyAdmin, getVerifiedUser);
router.post(
  "/remove-from-admin",
  verifySuperAdmin,
  removeFromAdmin
);

export default router;
