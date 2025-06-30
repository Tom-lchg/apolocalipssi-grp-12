import type { FC, JSX } from "react";
import { Link } from "react-router";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";

const Footer: FC = (): JSX.Element => {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50 p-12">
      <section className="max-w-5xl mx-auto space-y-6 text-center">
        <h2>Prêt à gagner du temps ?</h2>
        <p className="max-w-xl mx-auto">
          Testez notre outil gratuitement, sans inscription obligatoire.
          Essayez-le maintenant et transformez la façon dont vous gérez vos
          lectures de PDF.
        </p>
        <Link to="/login" className={cn(buttonVariants())}>
          Essayer
        </Link>
      </section>
    </footer>
  );
};

export default Footer;
