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
  removeSuspension,
  getSuspendedAccount,
  deleteCommentAndReplyByAdmin,
  getAllAdmins,
} from "../controllers/admin.controller.js";
import verifySuperAdmin from "../middlewares/verifySuperAdmin.js";


router.post("/isAdmin", isAdmin);



// these routes are protected by verifyUser and verifyAdmin middlewares

router.post("/suspend-user", suspendAccount);
router.post("/remove-suspension", removeSuspension);
router.post("/create", createAdmin);
router.get("/unverified-users", getAllUnverifiedUsers);
router.post("/verify-user", verifyUserFromAdmin);
router.post("/reject-user", rejectUserFromAdmin);
router.get("/get-verified-user", getVerifiedUser);
router.post(
  "/remove-from-admin",
  verifySuperAdmin,
  removeFromAdmin
);

router.get("/suspended-users", getSuspendedAccount);

router.get("/all-admins", getAllAdmins);

router.delete("/delete-comment/:commentId", deleteCommentAndReplyByAdmin);

export default router;
