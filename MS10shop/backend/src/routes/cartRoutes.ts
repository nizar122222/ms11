import { Router } from "express";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cartController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getCart);
router.post("/add", authenticate, addToCart);
router.put("/item/:itemId", authenticate, updateCartItem);
router.delete("/item/:itemId", authenticate, removeFromCart);
router.delete("/clear", authenticate, clearCart);

export default router;
