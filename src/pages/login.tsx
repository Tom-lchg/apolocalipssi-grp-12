import type { FC, JSX } from "react";
import { Link } from "react-router";

const Login: FC = (): JSX.Element => {
  return (
    <section className="max-w-5xl mx-auto mt-32 space-y-48 pb-48 text-center">
      <article className="space-y-4">
        <h2>Apocalipssi - Login</h2>
        <Link to="/register">Vous n'avez pas de compte ?</Link>
      </article>
    </section>
  );
};

export default Login;
