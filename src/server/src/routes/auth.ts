import bcrypt from "bcryptjs";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = Router();

// Regex simple pour valider l'email
const emailRegex = /^\S+@\S+\.\S+$/;

/**
 * Route d'inscription : hash du mot de passe et création de l'utilisateur
 */
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation des champs
  if (!email) {
    return res.status(400).json({ error: "L'email est requis" });
  }
  if (!password) {
    return res.status(400).json({ error: "Le mot de passe est requis" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "L'email n'est pas valide" });
  }

  const lowerEmail = email.toLowerCase();

  try {
    // Hash du mot de passe
    const hash = await bcrypt.hash(password, 10);
    // Création de l'utilisateur
    const user = await User.create({ email: lowerEmail, password: hash });
    return res.json({
      success: true,
      user: { id: user._id, email: user.email },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // Si email déjà utilisé (duplicate key)
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
    return res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

/**
 * Route de connexion : vérification des identifiants et génération d'un token JWT
 */
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation des champs
  if (!email) {
    return res.status(400).json({ error: "L'email est requis" });
  }
  if (!password) {
    return res.status(400).json({ error: "Le mot de passe est requis" });
  }

  const lowerEmail = email.toLowerCase();

  try {
    // Recherche de l'utilisateur
    const user = await User.findOne({ email: lowerEmail });
    if (!user) {
      return res.status(400).json({ error: "Utilisateur inconnu" });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Génération du JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    return res.json({ success: true, token });
  } catch {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
