import { Router } from "express";
import { createOrder, getOrders, getOrder, updateOrderStatus, getOrderStats } from "../controllers/orderController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, createOrder);
router.get("/", authenticate, getOrders);
router.get("/stats", authenticate, authorize("ADMIN"), getOrderStats);
router.get("/:id", authenticate, getOrder);
router.put("/:id/status", authenticate, authorize("ADMIN"), updateOrderStatus);

export default router;
