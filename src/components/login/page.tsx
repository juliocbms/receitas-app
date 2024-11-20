"use client";

import { useState } from "react";
import { Layout } from "../login/layout"; // Importando o layout de login
import { Input } from "@/components/page"; // Componente Input reutilizável
import { useRouter } from "next/navigation"; // Para redirecionar após o login
import { Alert } from "@/components/common/message/page"; // Para mensagens de alerta
import { signIn } from "next-auth/react";

interface LoginForm {
  email: string;
  senha: string;
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");  // Definindo o estado para email
  const [password, setPassword] = useState<string>(""); 
  const [errorMessage, setErrorMessage] = useState(""); // Definindo o estado para senha

  const router = useRouter();  // Hook para redirecionamento após login

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard", // Define o callbackUrl para onde redirecionar após o login
    });

    console.log("Resultado do login:", result); // Inspecione o que o signIn retorna
  
    if (result?.error) {
      setErrorMessage("Credenciais inválidas.");
    } else {
      // Usando result.url que é onde o NextAuth redirecionaria automaticamente
      router.push(result?.url || "/"); // Redireciona para a URL fornecida no result.url ou para uma página padrão
    }
  }

  return (
    <Layout titulo="Login">
      <form onSubmit={login}>
      {errorMessage && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
          {errorMessage}
        </div>)}
        <div className="columns">
          <Input
            label="Email: *"
            columnClasses="is-full"
            type="input"
            value={email}
            onChange={(value) => setEmail(value)} // Atualiza o estado do email
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
            onChange={(value) => setPassword(value)} // Atualiza o estado da senha
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
