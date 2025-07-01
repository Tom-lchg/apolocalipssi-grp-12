import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button, buttonVariants } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { cn } from "../lib/utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/summarize");
      } else {
        setError(data.error || "Erreur de connexion");
      }
    } catch {
      setError("Erreur serveur");
    }
  };

  return (
    <section className="max-w-5xl mx-auto mt-32 pb-32 space-y-6">
      <h1 className="text-3xl font-bold text-center">Se connecter</h1>
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
        <Button className="w-full" onClick={handleSubmit}>
          Connexion
        </Button>
        {error && (
          <p className="text-red-600 text-center">{error}</p>
        )}
      </div>

      <Separator className="my-8" />

      <p className="text-center">
        Pas encore de compte ?{" "}
        <Link to="/register" className={cn(buttonVariants({ variant: "link" }))}>
          S’inscrire
        </Link>
      </p>
    </section>
  );
};

export default Login;
