import type { FC, JSX } from "react";
import { Link } from "react-router";

const Register: FC = (): JSX.Element => {
  return (
    <section className="max-w-5xl mx-auto mt-32 space-y-48 pb-48 text-center">
      <article className="space-y-4">
        <h2>Apocalipssi - Register</h2>
        <Link to="/login">Vous avez déjà un compte ?</Link>
      </article>
    </section>
  );
};

export default Register;
