import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github";
import { cookies } from "next/headers";

const handler = NextAuth({
    pages:{
        signIn: "/Log",
    },
 providers: [
    CredentialsProvider({
      
      name: 'Credentials',
      
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
      
        try {
          const response = await fetch("http://localhost:8080/api/usuarios/autenticar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              senha: credentials.password, // Note que `senha` é o nome esperado na API
            }),
          });
      
          if (response.status !== 200) {
            return null; // Credenciais inválidas
          }
      
          const authData = await response.json();
      
          if (!authData.token || !authData.nome) {
            return null; // Token ou nome ausentes na resposta
          }
          (await cookies()).set("jwt", authData.jwt)
      
          return {
            id: authData.id, // Você pode usar um ID único se disponível
            name: authData.nome,
            email: credentials.email,
            token: authData.token, // Inclui o token se necessário
          };
        } catch (e) {
          return null; // Qualquer erro de conexão ou na resposta
        }
      }
    }),

    GitHubProvider({
        clientId: process.env.GITHUB_ID ?? "",
        clientSecret: process.env.GITHUB_SECRET ?? ""
      })
  ]
  
})

export { handler as GET, handler as POST }