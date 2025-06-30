import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button, buttonVariants } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { cn } from "../lib/utils";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Reset des erreurs
    setError("");

    // Validation email
    if (!isValidEmail(email)) {
      setError("Merci de saisir une adresse email valide.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/login");
      } else {
        setError(data.error || "Erreur d'inscription");
      }
    } catch {
      setError("Erreur serveur");
    }
  };

  return (
    <section className="max-w-5xl mx-auto mt-32 pb-32 space-y-6">
      <h1 className="text-3xl font-bold text-center">Créer un compte</h1>
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!email || !password || !isValidEmail(email)}
        >
          S’inscrire
        </Button>
        {error && <p className="text-red-600 text-center">{error}</p>}
      </div>

      <Separator className="my-8" />

      <p className="text-center">
        Déjà un compte ?{" "}
        <Link to="/login" className={cn(buttonVariants({ variant: "link" }))}>
          Se connecter
        </Link>
      </p>
    </section>
  );
};

export default Register;
