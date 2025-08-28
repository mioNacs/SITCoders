import { Router } from "express";
import isVarifiedByAdmin from "../middlewares/isVarifiedByAdmin.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import {
  createResource,
  getAllResources,
  updateResource,
  deleteResource,
  upvoteResource,
  getPendingResources,
  approveResource,
  rejectResource,
} from "../controllers/resource.controller.js";

const router = Router();

// Public routes for fetching resources
router.get("/get-all", getAllResources);

// Protected routes for authenticated users
router.post("/create", isVarifiedByAdmin, createResource);
router.post("/upvote/:resourceId", isVarifiedByAdmin, upvoteResource);

// Protected routes for authors and admins
router.put("/edit/:resourceId", isVarifiedByAdmin, updateResource);
router.delete("/delete/:resourceId", isVarifiedByAdmin, deleteResource);

// Admin-only routes
router.get("/admin/pending", verifyAdmin, getPendingResources);
router.patch("/admin/approve/:resourceId", verifyAdmin, approveResource);
router.patch("/admin/reject/:resourceId", verifyAdmin, rejectResource);

export default router;