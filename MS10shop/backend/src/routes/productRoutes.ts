import { Router } from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController";
import { authenticate, authorize } from "../middleware/auth";
import { upload, handleUploadError } from "../middleware/upload";

const router = Router();

router.get("/", getProducts);
router.get("/:slug", getProduct);
router.post("/", authenticate, authorize("ADMIN"), upload.array("images", 10), handleUploadError, createProduct);
router.put("/:id", authenticate, authorize("ADMIN"), upload.array("images", 10), handleUploadError, updateProduct);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteProduct);

export default router;
