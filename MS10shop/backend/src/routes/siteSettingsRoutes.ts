import { Router } from "express";
import { getSettings, updateSettings, getCustomizationSettings } from "../controllers/siteSettingsController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/", getSettings);
router.put("/", authenticate, authorize("ADMIN"), updateSettings);
router.get("/customization", getCustomizationSettings);

export default router;
