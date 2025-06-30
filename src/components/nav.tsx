import type { FC, JSX } from "react";
import { Link } from "react-router";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";

const Nav: FC = (): JSX.Element => {
  return (
    <nav className="fixed top-0 w-full border-b border-zinc-100 h-20 bg-background">
      <section className="max-w-5xl mx-auto flex justify-between items-center h-full">
        <article>
          <Link
            to="/"
            className="hover:no-underline text-4xl font-bold -tracking-[2px]"
          >
            Apolalipssi
          </Link>
        </article>
        <article className="flex items-center gap-2">
          <Link to="/summerize" className={cn(buttonVariants())}>
            Essayer
          </Link>
          <Link
            to="/login"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Connexion
          </Link>
        </article>
      </section>
    </nav>
  );
};

export default Nav;
