// src/types/next-auth.d.ts
import { Session } from "next-auth";

// Extensão do tipo default do next-auth para incluir o 'id'
declare module "next-auth" {
  interface Session {
    user: {
      id: string;  // ou number dependendo do tipo do seu id
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
