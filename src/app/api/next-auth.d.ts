import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    nome: string;
    email: string;
    token: string;
  }

  interface Session {
    user: {
      id: string;
      nome: string;
      email: string;
      accessToken: string;
    };
  }

  interface JWT {
    id: string;
    nome: string;
    email: string;
    accessToken: string;
  }
}
