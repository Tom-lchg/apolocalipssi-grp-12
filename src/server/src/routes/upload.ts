import { Response, Router } from "express";
import pdfParse from "pdf-parse";
import { anonymizePII } from "../lib/anonymizer";
import { IRequestWithFile, ISummarizeResponse } from "../types";
import { upload } from "../utils";
import { Summary } from "../models/Summary";
import { authMiddlewareOptional, AuthenticatedRequest } from "../middleware/authMiddleware";

// Interface pour la réponse de l'API Ollama
interface IOllamaResponse {
  response: string;
  done: boolean;
}

const router = Router();

/**
 * Route pour générer un résumé à partir d'un fichier PDF
 */
router.post(
  "/",
  authMiddlewareOptional,
  upload.single("file"),
  async (req: IRequestWithFile & AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Aucun fichier PDF fourni",
        } as ISummarizeResponse);
      }

      // Extraction du texte du PDF
      const pdfData = await pdfParse(req.file.buffer);
      let text = pdfData.text;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Impossible d'extraire du texte du PDF",
        } as ISummarizeResponse);
      }

      // ANONYMISATION des données personnelles AVANT envoi à l'IA
      text = anonymizePII(text);

      let summary: string;
      let keyPoints: string[];

      try {
        // Appel à Ollama pour générer le résumé
        const summaryRes = await fetch(
          "http://host.docker.internal:11434/api/generate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gemma:2b",
              prompt: `Fait moi le résumé de ce texte en max 1500 caractères: ${text}`,
              stream: false,
            }),
          }
        );

        const summaryData = (await summaryRes.json()) as IOllamaResponse;

        // Vérification que la réponse contient bien les données attendues
        if (!summaryData.response) {
          console.warn("Réponse Ollama invalide pour le résumé:", summaryData);
          throw new Error("Réponse invalide d'Ollama pour le résumé");
        }

        summary = summaryData.response;

        // Appel à Ollama pour générer les points clés
        const keyPointsRes = await fetch(
          "http://host.docker.internal:11434/api/generate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gemma:2b",
              prompt: `Extrait 5 points clés de ce texte. Réponds uniquement avec les points clés, un par ligne, sans numérotation: ${text}`,
              stream: false,
            }),
          }
        );

        const keyPointsData = (await keyPointsRes.json()) as IOllamaResponse;

        // Vérification que la réponse contient bien les données attendues
        if (!keyPointsData.response) {
          console.warn(
            "Réponse Ollama invalide pour les points clés:",
            keyPointsData
          );
          keyPoints = ["Aucun point clé extrait"];
        } else {
          keyPoints = keyPointsData.response
            .split("\n")
            .map((point) => point.trim())
            .filter((point) => point.length > 0)
            .slice(0, 5);

          // Si aucun point clé n'a été extrait, on utilise un point par défaut
          if (keyPoints.length === 0) {
            keyPoints = ["Aucun point clé extrait"];
          }
        }
      } catch (modelError) {
        console.error("Erreur avec le modèle Ollama:", modelError);
        return res.status(500).json({
          success: false,
          error: "Erreur lors de la génération du résumé avec Ollama",
          summary: "",
          keyPoints: [],
        });
      }

      // Enregistrement si utilisateur connecté
      if (req.user?.id) {
        await Summary.create({
          user: req.user.id,
          originalText: text,
          summary,
          keyPoints,
        });
      }

      return res.json({
        success: true,
        summary,
        keyPoints,
      } satisfies ISummarizeResponse);
    } catch (err) {
      console.error("Erreur traitement PDF:", err);
      return res.status(500).json({
        success: false,
        error: "Erreur lors du traitement du PDF",
        summary: "",
        keyPoints: [],
      });
    }
  }
);

export default router;
