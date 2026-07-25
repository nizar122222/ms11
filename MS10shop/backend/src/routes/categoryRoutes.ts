import { Router } from "express";
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/", getCategories);
router.get("/:slug", getCategory);
router.post("/", authenticate, authorize("ADMIN"), createCategory);
router.put("/:id", authenticate, authorize("ADMIN"), updateCategory);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteCategory);

export default router;
