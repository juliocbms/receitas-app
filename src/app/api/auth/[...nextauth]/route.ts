// src/app/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    pages: {
        signIn: "/login", // A página de login personalizada
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
  
          if (credentials.email === "julio@email.com" && credentials.password === "senha") {
            return {
              id: "1",
              name: "Julio",
              email: "julio@email.com",
            };
          }
  
          return null;
        },
      }),
    ],
    session: {
      strategy: "jwt", // Garante que a sessão será baseada em JWT
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
        }
        return token;
      },
      async session({ session, token }) {
        session.user = token;
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Exportação explícita dos métodos HTTP para suporte ao Next.js 13
export { handler as GET, handler as POST };
