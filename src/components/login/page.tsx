"use client"; // Diretiva para indicar que o componente é do lado do cliente

import { useState, useEffect } from "react";
import { Layout } from "../login/layout"; // Layout de login
import { Input } from "@/components/page"; // Componente de input reutilizável
import { useRouter } from "next/navigation"; // Para navegação
import { signIn } from "next-auth/react"; // Para autenticação via NextAuth

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const entrar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Tentando fazer login com NextAuth
      const res = await signIn("credentials", {
        redirect: false, // Não faz redirecionamento automático
        email,
        password,
      });

      if (res?.error) {
        setErrorMessage("Credenciais inválidas.");
      } else if (res?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Erro ao fazer login.");
    }
  };

  return (
    <Layout titulo="Login">
      <form onSubmit={entrar}>
        {errorMessage && <div style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</div>}

        <div className="columns">
          <Input
            label="Email: *"
            columnClasses="is-full"
            type="input"
            value={email}
            onChange={(value) => setEmail(value)}
            placeholder="Digite seu email"
            id="inputEmail"
          />
        </div>

        <div className="columns">
          <Input
            label="Senha: *"
            columnClasses="is-full"
            type="password"
            value={password}
            onChange={(value) => setPassword(value)}
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
