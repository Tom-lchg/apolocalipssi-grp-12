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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      // Création du FormData pour envoyer le fichier et le modèle sélectionné
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:3001/summarize/pdf", {
        method: "POST",
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
            <div className="space-y-2">
              <h3>Résumé</h3>
              <p>{summary.summary}</p>
            </div>

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
