import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Tipagem para o usuário
interface User {
  id: string;
  nome: string;
  email: string;
  token: string;
}

const handler = NextAuth({
  pages: {
    signIn: "/login", // Página de login personalizada
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        try {
          const response = await axios.post(
            "http://localhost:8080/api/usuarios/autenticar", // Endpoint da API
            {
              email: credentials.email,
              senha: credentials.password,
            }
          );

          const user = response.data;

          if (user && user.token) {
            return {
              id: String(user.id), // Garantindo que seja uma string
              nome: String(user.nome), // Garantindo que seja uma string
              email: String(user.email), // Garantindo que seja uma string
              token: user.token, // Garantindo que seja uma string
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Erro na autenticação com a API:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Sessão baseada em JWT
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id); // Garantindo que seja uma string
        token.nome = String(user.nome); // Garantindo que seja uma string
        token.email = String(user.email); // Garantindo que seja uma string
        token.accessToken = String(user.token); // Garantindo que seja uma string
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: String(token.id), // Garantindo que seja uma string
        nome: String(token.nome), // Garantindo que seja uma string
        email: String(token.email), // Garantindo que seja uma string
        accessToken: String(token.accessToken), // Garantindo que seja uma string
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret do NextAuth
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // Expira em 1 dia
      },
    },
  },
});

export { handler as GET, handler as POST };
