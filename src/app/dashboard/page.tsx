import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogOutButton from "@/components/login/logout/page";

export default async function DashboardPage() {
  // Verifica a sessão do usuário no lado do servidor
  const session = await getServerSession();

  console.log("Sessão atual:", session);
  // Se não estiver autenticado, redireciona para o login
  if (!session) {
    redirect("/Log");
  }

  return (
    <div>
      <h1>Bem-vindo(a), {session?.user?.name}!</h1>
      <p>Este é o painel do dashboard.</p>
      <div>
        <LogOutButton/>
      </div>
    </div>
  );
}
