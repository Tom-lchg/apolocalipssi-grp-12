import multer from "multer";

/**
 * Fonction pour créer un résumé simple en cas d'échec du modèle IA
 * @param text - Le texte à résumer
 * @param maxLength - La longueur maximale du résumé
 * @returns Un résumé simple basé sur les premières phrases
 */
export function createSimpleSummary(
  text: string,
  maxLength: number = 150
): string {
  // Diviser le texte en phrases
  const sentences = text
    .replace(/[.!?]+/g, ".")
    .split(".")
    .map((sentence: string) => sentence.trim())
    .filter((sentence: string) => sentence.length > 10);

  // Prendre les premières phrases jusqu'à la limite de longueur
  let summary = "";
  for (const sentence of sentences) {
    if ((summary + sentence).length <= maxLength) {
      summary += sentence + ". ";
    } else {
      break;
    }
  }

  return summary.trim() || "Résumé non disponible";
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers PDF sont acceptés"));
    }
  },
});
