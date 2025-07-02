/**
 * Tests unitaires pour la route de résumé de texte
 * Teste les différentes fonctionnalités de l'endpoint /text
 */

import express from "express";
import request from "supertest";
import app from "..";
import { hf } from "../lib/hugging-face";
import textRouter from "../routes/summarize/text";
import { createSimpleSummary } from "../utils";

jest.mock("../lib/hugging-face", () => ({
  hf: {
    summarization: jest.fn(),
  },
}));

jest.mock("../utils", () => ({
  createSimpleSummary: jest.fn(),
}));

// Configuration de l'application Express pour les tests
app.use(express.json());
app.use("/summarize", textRouter);

// Types pour les mocks
const mockHf = hf as jest.Mocked<typeof hf>;
const mockCreateSimpleSummary = createSimpleSummary as jest.MockedFunction<
  typeof createSimpleSummary
>;

describe("Route /summarize/text", () => {
  /**
   * Nettoyage des mocks avant chaque test
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /summarize/text - Validation des entrées", () => {
    /**
     * Test de validation avec un texte vide
     */
    it("devrait retourner une erreur 400 quand le texte est vide", async () => {
      const response = await request(app)
        .post("/summarize/text")
        .send({ text: "" })
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: "Le texte est requis",
      });
    });

    /**
     * Test de validation avec un texte manquant
     */
    it("devrait retourner une erreur 400 quand le texte est manquant", async () => {
      const response = await request(app)
        .post("/summarize/text")
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: "Le texte est requis",
      });
    });

    /**
     * Test de validation avec un texte contenant seulement des espaces
     */
    it("devrait retourner une erreur 400 quand le texte ne contient que des espaces", async () => {
      const response = await request(app)
        .post("/summarize/text")
        .send({ text: "   " })
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: "Le texte est requis",
      });
    });
  });

  describe("POST /summarize/text - Erreur de configuration API", () => {
    /**
     * Test de gestion de l'erreur quand la clé API n'est pas configurée
     */
    it("devrait retourner une erreur 500 quand la clé API Hugging Face n'est pas configurée", async () => {
      // Sauvegarde de la variable d'environnement
      const originalApiKey = process.env.HUGGINGFACE_API_KEY;
      delete process.env.HUGGINGFACE_API_KEY;

      const response = await request(app)
        .post("/summarize/text")
        .send({ text: "Test text" })
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: "Clé API Hugging Face non configurée",
      });

      // Restauration de la variable d'environnement
      process.env.HUGGINGFACE_API_KEY = originalApiKey;
    });
  });

  describe("POST /summarize/text - Succès avec modèle IA", () => {
    /**
     * Test de succès avec le modèle Hugging Face
     */
    it("devrait retourner un résumé et des points clés avec succès", async () => {
      const mockText =
        "Ceci est un texte de test pour vérifier le fonctionnement du résumé automatique. Il contient plusieurs phrases pour tester l'extraction des points clés.";
      const mockSummary = "Résumé généré par l'IA";
      const mockKeyPoints = [
        "Ceci est un texte de test pour vérifier le fonctionnement du résumé automatique.",
        "Il contient plusieurs phrases pour tester l'extraction des points clés.",
      ];

      // Configuration du mock Hugging Face
      mockHf.summarization.mockResolvedValue({
        summary_text: mockSummary,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const response = await request(app)
        .post("/summarize/text")
        .send({ text: mockText, maxLength: 100 })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        summary: mockSummary,
        keyPoints: mockKeyPoints,
      });

      // Vérification que le mock a été appelé avec les bons paramètres
      expect(mockHf.summarization).toHaveBeenCalledWith({
        model: "sshleifer/distilbart-cnn-12-6",
        inputs: mockText,
        parameters: {
          max_length: 100,
          min_length: 30,
          do_sample: false,
        },
      });
    });

    /**
     * Test avec la longueur maximale par défaut
     */
    it("devrait utiliser la longueur maximale par défaut de 150", async () => {
      const mockText = "Texte de test";
      const mockSummary = "Résumé par défaut";

      mockHf.summarization.mockResolvedValue({
        summary_text: mockSummary,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      await request(app)
        .post("/summarize/text")
        .send({ text: mockText })
        .expect(200);

      expect(mockHf.summarization).toHaveBeenCalledWith({
        model: "sshleifer/distilbart-cnn-12-6",
        inputs: mockText,
        parameters: {
          max_length: 150,
          min_length: 30,
          do_sample: false,
        },
      });
    });
  });

  describe("POST /summarize/text - Fallback vers résumé simple", () => {
    /**
     * Test de fallback quand le modèle IA échoue
     */
    it("devrait utiliser le résumé simple quand le modèle IA échoue", async () => {
      const mockText = "Texte de test pour fallback";
      const mockSimpleSummary = "Résumé simple de fallback";
      const mockKeyPoints = ["Texte de test pour fallback"];

      // Configuration du mock pour simuler une erreur du modèle IA
      mockHf.summarization.mockRejectedValue(new Error("Erreur modèle IA"));
      mockCreateSimpleSummary.mockReturnValue(mockSimpleSummary);

      const response = await request(app)
        .post("/summarize/text")
        .send({ text: mockText, maxLength: 100 })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        summary: mockSimpleSummary,
        keyPoints: mockKeyPoints,
      });

      // Vérification que la fonction de fallback a été appelée
      expect(mockCreateSimpleSummary).toHaveBeenCalledWith(mockText, 100);
    });
  });

  describe("POST /summarize/text - Extraction des points clés", () => {
    /**
     * Test d'extraction des points clés avec un texte normal
     */
    it("devrait extraire les points clés correctement", async () => {
      const mockText =
        "Première phrase importante. Deuxième phrase avec du contenu. Troisième phrase pour tester. Quatrième phrase de test. Cinquième phrase importante. Sixième phrase qui ne devrait pas être incluse.";
      const mockSummary = "Résumé test";

      mockHf.summarization.mockResolvedValue({
        summary_text: mockSummary,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const response = await request(app)
        .post("/summarize/text")
        .send({ text: mockText })
        .expect(200);

      // Vérification que les points clés sont extraits (max 5 phrases)
      expect(response.body.keyPoints).toHaveLength(5);
      expect(response.body.keyPoints[0]).toContain(
        "Première phrase importante"
      );
      expect(response.body.keyPoints[1]).toContain(
        "Deuxième phrase avec du contenu"
      );
    });

    /**
     * Test d'extraction des points clés avec un texte court
     */
    it("devrait retourner un point clé par défaut pour un texte trop court", async () => {
      const mockText = "Texte court";
      const mockSummary = "Résumé court";

      mockHf.summarization.mockResolvedValue({
        summary_text: mockSummary,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const response = await request(app)
        .post("/summarize/text")
        .send({ text: mockText })
        .expect(200);

      expect(response.body.keyPoints).toEqual(["Aucun point clé extrait"]);
    });
  });

  describe("POST /summarize/text - Gestion des erreurs", () => {
    /**
     * Test de gestion des erreurs générales
     */
    it("devrait gérer les erreurs inattendues", async () => {
      // Mock pour simuler une erreur inattendue
      mockHf.summarization.mockImplementation(() => {
        throw new Error("Erreur inattendue");
      });

      const response = await request(app)
        .post("/summarize/text")
        .send({ text: "Test error handling" })
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: "Erreur lors de la génération du résumé",
        summary: "",
        keyPoints: [],
      });
    });
  });
});
