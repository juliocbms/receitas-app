"use client"; 

import { useState } from "react";
import { Layout } from "../login/layout"; 
import { Input } from "@/components/page"; 
import { signIn } from "next-auth/react"; 
import { useSearchParams } from "next/navigation";

export const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");  // Controle para o email
  const [password, setPassword] = useState<string>("");  // Controle para a senha

  const serchParams = useSearchParams();
  const error = serchParams.get('error');

  const entrar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log(data);

    const result = await signIn("credentials", {
      ...data,
      callbackUrl: "/",
    });

    if (result?.error) {
      setErrorMessage("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <Layout titulo="Login">
      <form onSubmit={entrar}>
        {errorMessage && <div style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</div>}
        {error === "CredentialsSignin" && <div style={{ color: "red", marginBottom: "1rem" }}>Erro ao logar.</div>}
        <div className="columns">
          <Input
            label="Email: *"
            columnClasses="is-full"
            type="email"
            name="email"
            value={email}  // Passando o valor para o Input
            onChange={(value) => setEmail(value)}  // Atualizando o estado
            placeholder="Digite seu email"
            id="inputEmail"
          />
        </div>

        <div className="columns">
          <Input
            label="Senha: *"
            columnClasses="is-full"
            type="password"
            name="password"
            value={password}  // Passando o valor para o Input
            onChange={(value) => setPassword(value)}  // Atualizando o estado
            placeholder="Digite sua senha"
            id="inputSenha"
          />
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-link">
              Entrar
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
};
