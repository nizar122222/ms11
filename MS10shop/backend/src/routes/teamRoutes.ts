import { Router } from "express";
import { getTeams, getTeam, createTeam, updateTeam, deleteTeam } from "../controllers/teamController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/", getTeams);
router.get("/:slug", getTeam);
router.post("/", authenticate, authorize("ADMIN"), createTeam);
router.put("/:id", authenticate, authorize("ADMIN"), updateTeam);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteTeam);

export default router;
