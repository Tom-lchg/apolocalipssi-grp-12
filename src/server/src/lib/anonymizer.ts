export function anonymizePII(text: string): string {
  // Masque les emails
  text = text.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[EMAIL]');
  // Masque les numéros de téléphone français (exemple simple)
  text = text.replace(/(\+33|0)[1-9](\d{2}){4}/g, '[PHONE]');
  // Masque les noms propres (exemple basique, à améliorer)
  text = text.replace(/\b([A-Z][a-z]{2,})\b/g, '[NAME]');
  return text;
}