import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState, type FC, type JSX } from "react";
import { Button } from "../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import { Input } from "../components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Separator } from "../components/ui/separator";
import { cn } from "../lib/utils";

// Interface pour définir la structure d'un modèle d'IA
interface IModel {
  id: string;
  modelId: string;
  pipeline_tag: string;
  library_name: string;
  likes: number;
  downloads: number;
}

const Summarize: FC = (): JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState({
    summary: "",
    keyPoints: [],
  });
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<IModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [modelsLoading, setModelsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  /**
   * Récupère la liste des modèles d'IA disponibles depuis l'API Hugging Face
   */
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(
          "https://huggingface.co/api/models?pipeline_tag=summarization"
        );
        const data = await response.json();

        /**
         * On filtre les modèles OpenAI, GPT et ChatGPT car ils ne sont plus disponibles
         * On utilise un regex pour cibler les modèles qui contiennent "openai", "gpt" ou "chatgpt"
         */
        const filtered = data.filter(
          (model: IModel) => !/openai|gpt|chatgpt/i.test(model.modelId)
        );

        setModels(filtered);
      } catch (error) {
        console.error("Erreur lors de la récupération des modèles:", error);
      } finally {
        setModelsLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  /**
   * Gère la sélection d'un modèle d'IA
   */
  const handleModelChange = (value: string) => {
    setSelectedModel(value === selectedModel ? "" : value);
    setOpen(false);
  };

  const handleUpload = async () => {
    if (!file || !selectedModel) return;

    setLoading(true);

    try {
      // Création du FormData pour envoyer le fichier et le modèle sélectionné
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", selectedModel);

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

        {/* Sélection du modèle d'IA avec Combobox */}
        <div className="space-y-2">
          <label htmlFor="model-select" className="text-sm font-medium">
            Modèle d'IA
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={modelsLoading}
              >
                {selectedModel
                  ? models.find((model) => model.modelId === selectedModel)
                      ?.modelId
                  : "Sélectionnez un modèle d'IA"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher un modèle..." />
                <CommandList>
                  <CommandEmpty>Aucun modèle trouvé.</CommandEmpty>
                  <CommandGroup>
                    {modelsLoading ? (
                      <CommandItem value="loading" disabled>
                        Chargement des modèles...
                      </CommandItem>
                    ) : (
                      models.map((model) => (
                        <CommandItem
                          key={model.id}
                          value={model.modelId}
                          onSelect={handleModelChange}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedModel === model.modelId
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.modelId}
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-4">
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={!selectedModel}
            className={!selectedModel ? "opacity-50 cursor-not-allowed" : ""}
          />
          <Button
            onClick={handleUpload}
            disabled={loading || !selectedModel || !file}
          >
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
