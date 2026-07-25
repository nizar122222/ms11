import { Router } from "express";
import { toggleWishlist, getWishlist } from "../controllers/wishlistController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getWishlist);
router.post("/toggle", authenticate, toggleWishlist);

export default router;
