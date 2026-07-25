import { Router } from "express";
import { getReviews, createReview, approveReview, deleteReview } from "../controllers/reviewController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/", getReviews);
router.post("/", authenticate, createReview);
router.put("/:id/approve", authenticate, authorize("ADMIN"), approveReview);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteReview);

export default router;
