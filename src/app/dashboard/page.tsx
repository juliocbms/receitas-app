// src/app/dashboard/page.tsx
import LogOutButton from "@/components/login/logout/page";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession();

  console.log("Sessão atual:", session);
  // Se não estiver autenticado, redireciona para o login
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Bem-vindo(a), {session.user?.name}!</h1>
      <p>Este é o painel do dashboard.</p>
      <div>
        <LogOutButton/>
      </div>
    </div>
  );
}
