import { useEffect, useState } from "react";
import axios from "axios";

interface SummaryItem {
  _id: string;
  summary: string;
  keyPoints: string[];
  createdAt: string;
}

export default function HistoryPage() {
  const [summaries, setSummaries] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/summaries", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setSummaries((res.data as { data: SummaryItem[] }).data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement historique :", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="p-6 mt-24 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Historique de vos résumés</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : summaries.length === 0 ? (
        <p>Aucun résumé généré pour le moment.</p>
      ) : (
        <div className="space-y-6">
          {summaries.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-sm border border-gray-200 rounded-lg p-4"
            >
              <time className="text-sm text-gray-500 mb-2 block">
                {new Date(item.createdAt).toLocaleString("fr-FR")}
              </time>
              <p className="text-gray-800 mb-2 whitespace-pre-line">{item.summary}</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {item.keyPoints.map((kp, i) => (
                  <li key={i}>{kp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
