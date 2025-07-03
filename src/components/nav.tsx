import type { FC, JSX } from "react";
import { Link, useNavigate } from "react-router";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";

const Nav: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full border-b border-zinc-100 h-20 bg-background">
      <section className="max-w-5xl mx-auto flex justify-between items-center h-full">
        <article>
          <Link
            to="/"
            className="hover:no-underline text-4xl font-bold -tracking-[2px]"
          >
            Apocalipssi
          </Link>
        </article>
        <article className="flex items-center gap-2">
          {token ? (
            <>
              <Link to="/summarize" className={cn(buttonVariants())}>
                Essayer
              </Link>
              <Link to="/history" className={cn(buttonVariants({ variant: "ghost" }))}>
                Historique
              </Link>
              <button
                onClick={handleLogout}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={cn(buttonVariants({ variant: "outline" }))}>
                Connexion
              </Link>
              <Link to="/register" className={cn(buttonVariants())}>
                S’inscrire
              </Link>
            </>
          )}
        </article>
      </section>
    </nav>
  );
};

export default Nav;
