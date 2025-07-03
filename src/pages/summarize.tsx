import { useState, type FC, type JSX } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";

const Summarize: FC = (): JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState({
    summary: "",
    keyPoints: [],
  });
  const [loading, setLoading] = useState(false);

  /**
   * Gère le changement de fichier sélectionné
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  /**
   * Télécharge le résumé et les points clés dans un fichier .txt
   */
  const handleDownload = () => {
    if (!summary.summary) return;

    // Création du contenu du fichier
    const content = `RÉSUMÉ\n${"=".repeat(50)}\n\n${summary.summary
      }\n\n\nPOINTS CLÉS\n${"=".repeat(50)}\n\n${summary.keyPoints
        .map((point, index) => `${index + 1}. ${point}`)
        .join("\n")}`;

    // Création du blob et téléchargement
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Envoie le fichier PDF au serveur pour générer le résumé
   */
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      // Création du FormData pour envoyer le fichier et le modèle sélectionné
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/upload", {
        method: "POST",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined, // Pas d'en-tête si pas de token
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setSummary(data);
      } else {
        setSummary({
          summary: `Erreur: ${data.error}`,
          keyPoints: [],
        });
      }
    } catch (err) {
      console.error("Erreur :", err);
      setSummary({
        summary:
          "Une erreur est survenue lors de la communication avec le serveur.",
        keyPoints: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto mt-32 pb-32">
      <article className="space-y-4">
        <h1>Summerize</h1>
        <p>Insérez un fichier PDF pour générer un résumé</p>

        <div className="flex gap-4">
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="opacity-50 cursor-not-allowed"
          />
          <Button onClick={handleUpload} disabled={loading || !file}>
            {loading ? "Résumé en cours..." : "Envoyer"}
          </Button>
        </div>
      </article>

      {summary.summary && (
        <>
          <Separator className="my-12" />
          <article className="space-y-6">
            <div className="flex justify-between items-center">
              <h3>Résumé</h3>
              <Button onClick={handleDownload} variant="outline">
                Télécharger (.txt)
              </Button>
            </div>
            <p>{summary.summary}</p>

            <div className="space-y-2">
              <h3>Points clés</h3>
              <ul className="list-disc list-inside">
                {summary.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </article>
        </>
      )}
    </section>
  );
};

export default Summarize;
