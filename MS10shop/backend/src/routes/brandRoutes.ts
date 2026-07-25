import { Router } from "express";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../controllers/brandController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/", getBrands);
router.post("/", authenticate, authorize("ADMIN"), createBrand);
router.put("/:id", authenticate, authorize("ADMIN"), updateBrand);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteBrand);

export default router;
