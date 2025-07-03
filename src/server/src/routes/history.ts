import { Router, Response } from "express";
import { authMiddleware, AuthenticatedRequest } from "../middleware/authMiddleware";
import { Summary } from "../models/Summary";

const router = Router();

router.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await Summary.find({ user: req.user!.id })
      .sort({ createdAt: -1 })
      .select("summary keyPoints createdAt");

    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: "Impossible de récupérer l’historique" });
  }
});

export default router;
