// utils/auth.ts
export const getToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken"); // Garantir acesso ao lado do cliente
    }
    return null;
  };
  