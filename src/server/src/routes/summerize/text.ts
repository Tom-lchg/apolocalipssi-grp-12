/**
 * Route pour générer un résumé et les points clés d'un texte
 * Utilise le modèle Hugging Face pour l'extraction de points clés
 */

import { Request, Response, Router } from "express";
import { hf } from "../../lib/hugging-face";
import { ISummarizeRequest, ISummarizeResponse } from "../../types";
import { createSimpleSummary } from "../../utils";

const router = Router();

// @ts-expect-error - Express type error
router.post("/text", async (req: Request, res: Response) => {
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

    // Extraction des points clés en utilisant une approche simplifiée
    // Diviser le texte en phrases et extraire les phrases importantes
    const sentences = text
      .replace(/[.!?]+/g, ".")
      .split(".")
      .map((sentence: string) => sentence.trim())
      .filter(
        (sentence: string) => sentence.length > 20 && sentence.length < 200
      )
      .slice(0, 5);

    // Utiliser les premières phrases importantes comme points clés
    const keyPoints =
      sentences.length > 0 ? sentences : ["Aucun point clé extrait"];

    const response: ISummarizeResponse = {
      summary: summary,
      keyPoints: keyPoints,
      success: true,
    };

    res.json(response);
  } catch (error) {
    console.error("Erreur lors de la génération du résumé:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la génération du résumé",
      summary: "",
      keyPoints: [],
    } as ISummarizeResponse);
  }
});

export default router;
