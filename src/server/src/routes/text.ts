import { Request, Response, Router } from "express";
import { hf } from "../lib/hugging-face";
import { ISummarizeRequest, ISummarizeResponse } from "../types";
import { createSimpleSummary } from "../utils";
import { Summary } from "../models/Summary";
import { authMiddleware, AuthenticatedRequest } from "../middleware/authMiddleware";

const router = Router();

// Middleware d’authentification optionnelle
const optionalAuth = (req: Request, res: Response, next: Function): void => {
  authMiddleware(req as AuthenticatedRequest, res, () => next());
};

router.post("/", optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text, maxLength = 150 }: ISummarizeRequest = req.body;

    // Validation du texte d'entrée
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Le texte est requis",
      } as ISummarizeResponse);
    }

    // Vérification de la clé API
    if (!process.env.HUGGINGFACE_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Clé API Hugging Face non configurée",
      } as ISummarizeResponse);
    }

    let summary: string;

    try {
      // Tentative avec un modèle plus stable
      const result = await hf.summarization({
        model: "sshleifer/distilbart-cnn-12-6", // Modèle plus stable
        inputs: text,
        parameters: {
          max_length: maxLength,
          min_length: 30,
          do_sample: false,
        },
      });
      summary = result.summary_text;
    } catch (modelError) {
      console.warn(
        "Erreur avec le modèle IA, utilisation du résumé simple:",
        modelError
      );
      // Fallback vers un résumé simple
      summary = createSimpleSummary(text, maxLength);
    }

    const keyPoints = text
      .replace(/[.!?]+/g, ".")
      .split(".")
      .map((s) => s.trim())
      .filter((s) => s.length > 20 && s.length < 200)
      .slice(0, 5);

    const response: ISummarizeResponse = {
      summary,
      keyPoints: keyPoints.length > 0 ? keyPoints : ["Aucun point clé extrait"],
      success: true,
    };

    if (req.user?.id) {
      await Summary.create({
        user: req.user.id,
        originalText: text,
        summary: response.summary,
        keyPoints: response.keyPoints,
      });
    }

    return res.json(response);
  } catch (error) {
    console.error("Erreur lors de la génération du résumé:", error);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la génération du résumé",
      summary: "",
      keyPoints: [],
    });
  }
});

export default router;
