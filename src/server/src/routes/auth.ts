import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = Router();

// Route d'inscription : hash du mot de passe et création de l'utilisateur
router.post("/register", async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    return res.json({ success: true, user: { id: user._id, email: user.email } });
  } catch (err) {
    return res.status(400).json({ success: false, error: "Email déjà utilisé" });
  }
});

// Route de connexion : vérification des identifiants et génération d'un token JWT
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Utilisateur inconnu" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    return res.json({ success: true, token });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
