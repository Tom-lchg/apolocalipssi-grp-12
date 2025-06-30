import { Request } from "express";

/**
 * Interface pour la requête de résumé
 */
export interface ISummarizeRequest {
  text: string;
  maxLength?: number;
}

/**
 * Interface pour la réponse de résumé
 */
export interface ISummarizeResponse {
  summary: string;
  keyPoints: string[];
  success: boolean;
  error?: string;
}

/**
 * Interface pour étendre Request avec le fichier uploadé
 */
export interface IRequestWithFile extends Request {
  file?: Express.Multer.File;
}
