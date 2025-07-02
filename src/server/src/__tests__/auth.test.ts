/**
 * Tests unitaires pour les routes d'authentification
 * Teste les endpoints /auth/register et /auth/login
 */

import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../app";
import authRouter from "../routes/auth";
import { User } from "../models/User";

// Configuration de l'application Express pour les tests
app.use(express.json());
app.use("/auth", authRouter);

describe("Route /auth", () => {
  /**
   * Nettoyage de la base entre chaque test
   */
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /auth/register - Validation des entrées", () => {
    /**
     * Test sans email
     */
    it("devrait retourner une erreur 400 quand l'email est manquant", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ password: "Password123" })
        .expect(400);

      expect(response.body).toEqual({ error: "L'email est requis" });
    });

    /**
     * Test sans mot de passe
     */
    it("devrait retourner une erreur 400 quand le mot de passe est manquant", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ email: "test@example.com" })
        .expect(400);

      expect(response.body).toEqual({ error: "Le mot de passe est requis" });
    });

    /**
     * Test email invalide
     */
    it("devrait retourner une erreur 400 quand l'email n'est pas valide", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ email: "invalid-email", password: "Password123" })
        .expect(400);

      expect(response.body).toEqual({ error: "L'email n'est pas valide" });
    });
  });

  describe("POST /auth/register - Succès de l'inscription", () => {
    /**
     * Test de création d'utilisateur
     */
    it("devrait créer un utilisateur et retourner success + user", async () => {
      const validUser = { email: "test@example.com", password: "Password123" };

      const res = await request(app)
        .post("/auth/register")
        .send(validUser)
        .expect(200);

      expect(res.body).toHaveProperty("success", true);
      expect(res.body.user).toMatchObject({
        email: validUser.email,
        id: expect.any(String),
      });

      // Vérifier la présence en base
      const inDb = await User.findOne({ email: validUser.email });
      expect(inDb).not.toBeNull();
    });
  });

  describe("POST /auth/login - Validation des entrées", () => {
    /**
     * Test sans email
     */
    it("devrait retourner une erreur 400 quand l'email est manquant", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ password: "Password123" })
        .expect(400);

      expect(response.body).toEqual({ error: "L'email est requis" });
    });

    /**
     * Test sans mot de passe
     */
    it("devrait retourner une erreur 400 quand le mot de passe est manquant", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com" })
        .expect(400);

      expect(response.body).toEqual({ error: "Le mot de passe est requis" });
    });
  });

  describe("POST /auth/login - Succès et erreurs d'authentification", () => {
    /**
     * Pré-enregistrement de l'utilisateur pour les tests de login
     */
    beforeEach(async () => {
      await request(app)
        .post("/auth/register")
        .send({ email: "test@example.com", password: "Password123" });
    });

    /**
     * Test de login réussi
     */
    it("devrait retourner un token JWT valide", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "Password123" })
        .expect(200);

      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("token");

      const payload = jwt.verify(res.body.token, process.env.JWT_SECRET!);
      expect((payload as any)).toHaveProperty("id");
    });

    /**
     * Test utilisateur inconnu
     */
    it("devrait retourner 400 pour utilisateur inconnu", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "noone@nowhere.com", password: "Password123" })
        .expect(400);

      expect(response.body).toEqual({ error: "Utilisateur inconnu" });
    });

    /**
     * Test mot de passe incorrect
     */
    it("devrait retourner 401 pour mot de passe incorrect", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "WrongPass" })
        .expect(401);

      expect(response.body).toEqual({ error: "Mot de passe incorrect" });
    });
  });
});
