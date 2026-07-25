import { Router } from "express";
import { getCustomers, getCustomer, toggleCustomerStatus, getCustomerStats } from "../controllers/customerController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, authorize("ADMIN"), getCustomers);
router.get("/stats", authenticate, authorize("ADMIN"), getCustomerStats);
router.get("/:id", authenticate, authorize("ADMIN"), getCustomer);
router.put("/:id/toggle-status", authenticate, authorize("ADMIN"), toggleCustomerStatus);

export default router;
