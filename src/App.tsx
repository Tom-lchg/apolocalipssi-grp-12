import { Link } from "react-router";
import { buttonVariants } from "./components/ui/button";
import { cn } from "./lib/utils";

function App() {
  return (
    <section className="max-w-5xl mx-auto mt-32 space-y-48 pb-48">
      {/* HERO SECTION */}
      <article className="text-center space-y-6">
        <h1 className="text-7xl font-medium -tracking-[2px]">
          Résumez vos PDF en quelques secondes avec l’IA
        </h1>
        <p className="max-w-xl mx-auto">
          Envoyez votre fichier PDF, choisissez le modèle d’IA, et recevez
          instantanément un résumé clair avec les points clés. Simple, rapide,
          accessible partout.
        </p>
        <Link to="/summarize" className={cn(buttonVariants())}>
          Essayer maintenant
        </Link>

        <div className="w-full h-[550px] bg-red-50 rounded-lg" />
      </article>
      {/* HERO SECTION */}

      {/* SECTION COMMENT CA MARCHE ? */}
      <article className="grid grid-cols-1 lg:grid-cols-2">
        <div className="space-y-6">
          <h2>3 étapes simples pour résumer n’importe quel PDF</h2>
          <ul className="space-y-4">
            <li>Téléchargez votre PDF</li>
            <li>
              Sélectionnez le modèle IA de votre choix (ChatGPT, Claude,
              Mistral, etc.).
            </li>
            <li>
              Obtenez un résumé complet et téléchargeable, avec les points
              essentiels.
            </li>
          </ul>
        </div>
        <div className="w-full h-[550px] bg-red-50 rounded-lg" />
      </article>
      {/* SECTION COMMENT CA MARCHE ? */}

      {/* SECTION COMMENT CA MARCHE ? */}
      <article className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full h-[550px] bg-red-50 rounded-lg" />
        <div className="space-y-6">
          <h2>Un résumé intelligent de vos documents longs</h2>
          <p>
            Plus besoin de lire des dizaines de pages. Notre IA analyse le
            contenu, identifie les passages clés et vous livre un résumé
            structuré et synthétique, en quelques secondes.
          </p>
        </div>
      </article>
      {/* SECTION COMMENT CA MARCHE ? */}

      {/* SECTION FEATURE PRINCIPALE ? */}
      <article className="text-center space-y-6">
        <h2>Choisissez votre moteur d’intelligence préféré</h2>
        <p className="max-w-2xl mx-auto">
          Vous avez le contrôle : sélectionnez le modèle d’IA qui correspond à
          vos attentes (OpenAI, Anthropic, Mistral…). Changez de modèle à tout
          moment pour tester différentes perspectives.
        </p>
        <section className="flex items-center gap-4 mt-20 justify-center">
          <div className="w-32 h-32 bg-amber-200 rounded-full" />
          <div className="w-32 h-32 bg-blue-200 rounded-full" />
          <div className="w-32 h-32 bg-green-200 rounded-full" />
          <div className="w-32 h-32 bg-purple-200 rounded-full" />
          <div className="w-32 h-32 bg-red-50 rounded-full" />
        </section>
      </article>
      {/* SECTION FEATURE PRINCIPALE ? */}
    </section>
  );
}

export default App;
