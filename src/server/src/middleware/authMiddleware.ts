import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Étend Request pour inclure le user décodé
export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // Récupère le token depuis l'en-tête Authorization (format "Bearer <token>")
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    // Si aucun token fourni, on bloque l'accès
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    // Vérifie et décode le token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Ajoute les données décodées (ex : user.id) à req.user
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Token invalide" });
  }
}
