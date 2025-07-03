import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Typage optionnel du user décodé (selon ce que contient ton token JWT)
interface DecodedUser {
  _id: DecodedUser | undefined;
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
}

// Étend Request pour inclure req.user
export interface AuthenticatedRequest extends Request {
  user?: DecodedUser;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    // Si aucun token fourni, on bloque l'accès
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    req.user = decoded;
    return next(); // <- très important
  } catch {
    return res.status(401).json({ error: "Token invalide" });
  }
}

export function authMiddlewareOptional(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    // Pas de token = on continue sans user
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    req.user = decoded;
  } catch {
    // Token invalide = on ignore, mais on ne bloque pas
    req.user = undefined;
  }

  return next(); // Toujours continuer
}

