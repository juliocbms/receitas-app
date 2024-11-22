"use client";

import { ReactNode, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Loader } from "@/components/page";
import { useRouter } from "next/navigation";
import { TabelaLancamentos } from "./tabela/page";
import { Lancamento } from "@/app/models/lancamentos/page";
import { useLancamentoService } from "@/app/services/lancamento.service";
import { Alert } from "@/components/common/message/page";
import { MenuDois } from "./menu/page";

interface LayoutProps {
  titulo?: string;
  children?: ReactNode;
  mensagens?: Array<Alert>;
}

export const LayoutLista: React.FC<LayoutProps> = ({ titulo, children, mensagens }) => {
  const { data: session, status } = useSession(); // status para monitorar o carregamento da sessão
  const service = useLancamentoService();
  const [messages, setMessages] = useState<Array<Alert>>(mensagens || []);
  const [lista, setLista] = useState<Lancamento[]>([]);
  const router = useRouter();

  // Verifica se a sessão está carregada
  const shouldFetchData = session?.user?.id && status === "authenticated";

  // Função para obter o token Bearer
  const getToken = (): string | null => {
    const token = localStorage.getItem("authToken");
    return token;
  };

  // SWR para buscar os lançamentos, apenas quando a sessão estiver carregada
  const { data: result, error, isValidating } = useSWR<Lancamento[]>(
    shouldFetchData ? `/api/lancamentos?usuario=${session.user.id}` : null,
    async (url: string) => {
      console.log("Requisição para:", url); // Debug da URL
      const token = getToken();
      if (!token) {
        throw new Error("Token de autenticação não encontrado.");
      }

      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
      });

      if (!res.ok) {
        throw new Error("Erro na requisição");
      }
      return res.json();
    },
    { revalidateOnFocus: false } // Desativa recarregamento ao trocar de aba
  );

  useEffect(() => {
    if (result) {
      setLista(result);
    }
  }, [result]);

  // Caso haja erro, exibe mensagem de erro
  if (error) {
    console.error("Erro ao carregar dados dos lançamentos:", error);
    return <div className="notification is-danger">Erro ao carregar dados.</div>;
  }

  const editar = (lancamento: Lancamento) => {
    if (lancamento?.id) {
      const url = `/cadastros/receitas?id=${lancamento.id}`;
      router.push(url);
    } else {
      console.error("Lançamento inválido para edição.");
    }
  };

  const deletar = (lancamento: Lancamento) => {
    const id = lancamento?.id; // O id já está como string no modelo
    if (id) {
      service
        .deletar(id)
        .then(() => {
          setMessages([
            {
              tipo: "success",
              texto: "Lançamento excluído com sucesso!",
            },
          ]);
          // Comparação com strings diretamente
          setLista((prevLista) => prevLista.filter((l) => l.id !== id));
        })
        .catch((error) => {
          setMessages([
            {
              tipo: "error",
              texto: `Erro ao excluir lançamento: ${error.message}`,
            },
          ]);
        });
    } else {
      console.error("ID do lançamento não é válido.");
    }
  };

  return (
    <div className="app">
      <section className="main-content columns is-fullheight">
        <MenuDois />
        <div className="container column is-10">
          <div className="section">
            <div className="card">
              <div className="card-header">
                <p className="card-header-title">{titulo || "Lista de Lançamentos"}</p>
              </div>
              <div className="card-content">
                <div className="content">
                  {/* Loader enquanto os dados são carregados */}
                  <Loader show={isValidating} />

                  {/* Renderizando a tabela de lançamentos */}
                  {lista.length > 0 ? (
                    <TabelaLancamentos
                      onEdit={editar}
                      onDelete={deletar}
                      lancamentos={lista}
                    />
                  ) : (
                    !isValidating && (
                      <div className="notification is-info">
                        Nenhum lançamento encontrado.
                      </div>
                    )
                  )}

                  {/* Exibindo mensagens de sucesso ou erro */}
                  {messages &&
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`notification ${
                          msg.tipo === "success" ? "is-success" : "is-danger"
                        }`}
                      >
                        {msg.texto}
                      </div>
                    ))}

                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
