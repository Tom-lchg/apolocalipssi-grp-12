import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pdfSummary, setPdfSummary] = useState("");

  const handleTextSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3001/summarize/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setSummaryText(data.summary || "Aucun résumé reçu.");
    } catch (err) {
      setSummaryText("Erreur lors de la soumission du texte.");
    }
  };

  const handlePdfSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3001/summarize/pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setPdfSummary(data.summary || "Aucun résumé reçu.");
    } catch (err) {
      setPdfSummary("Erreur lors de l'upload du fichier.");
    }
  };

  return (
    <section>
      <h1>Apocalipssi</h1>
      <textarea rows={6} style={{ width: "100%" }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Entrez votre texte..." />
      <button onClick={handleTextSubmit}>Envoyer pour résumé</button>
      <div>
        <strong>Résumé :</strong>
        <p>{summaryText}</p>
      </div>

      <h2>Résumé de fichier PDF</h2>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)}/>
      <button onClick={handlePdfSubmit} disabled={!file}> Envoyer le fichier</button>
      <div>
        <strong>Résumé :</strong>
        <p>{pdfSummary}</p>
      </div>
    </section>
  )
}

export default App;
