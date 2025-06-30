import { Response, Router } from "express";
import pdfParse from "pdf-parse";
import { model, parameters } from "../../config";
import { hf } from "../../lib/hugging-face";
import { IRequestWithFile, ISummarizeResponse } from "../../types";
import { createSimpleSummary, upload } from "../../utils";

const router = Router();

/**
 * Route pour générer un résumé à partir d'un fichier PDF
 */
router.post(
  "/pdf",
  upload.single("file"),
  // @ts-expect-error - Express type error
  async (req: IRequestWithFile, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Aucun fichier PDF fourni",
        } as ISummarizeResponse);
      }

      // Extraction du texte du PDF
      const pdfData = await pdfParse(req.file.buffer);
      const text = pdfData.text;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Impossible d'extraire du texte du PDF",
        } as ISummarizeResponse);
      }

      let summary: string;

      try {
        const result = await hf.summarization({
          model, // variable définie dans le fichier config.ts
          inputs: text,
          parameters, // variable définie dans le fichier config.ts
        });
        summary = result.summary_text;
      } catch (modelError) {
        console.warn(
          "Erreur avec le modèle IA, utilisation du résumé simple:",
          modelError
        );
        summary = createSimpleSummary(text, parameters.max_length);
      }

      // Extraction des points clés
      const sentences = text
        .replace(/[.!?]+/g, ".")
        .split(".")
        .map((sentence: string) => sentence.trim())
        .filter(
          (sentence: string) => sentence.length > 20 && sentence.length < 200
        )
        .slice(0, 5);

      const keyPoints =
        sentences.length > 0 ? sentences : ["Aucun point clé extrait"];

      const response: ISummarizeResponse = {
        summary: summary,
        keyPoints: keyPoints,
        success: true,
      };

      res.json(response);
    } catch (error) {
      console.error("Erreur lors du traitement du PDF:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors du traitement du PDF",
        summary: "",
        keyPoints: [],
      } as ISummarizeResponse);
    }
  }
);

export default router;
