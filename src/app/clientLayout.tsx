// clientLayout.tsx (componente do cliente)
'use client'; // Marca este componente como cliente

import { SessionProvider } from "next-auth/react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
