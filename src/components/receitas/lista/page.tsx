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
import { fetchClient } from "@/app/libs/fetchClient/page";

interface LayoutProps {
  titulo?: string;
  children?: ReactNode;
  mensagens?: Array<Alert>;
}

export const LayoutLista: React.FC<LayoutProps> = ({ titulo, children, mensagens }) => {
  const { data: session, status } = useSession();
  const service = useLancamentoService();
  const [messages, setMessages] = useState<Array<Alert>>(mensagens || []);
  const [lista, setLista] = useState<Lancamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLancamentos = async () => {
      if (session?.user?.id) {
        try {
          setIsLoading(true);
          const response = await fetchClient(
            `http://localhost:8080/api/lancamentos?usuario=${session.user.id}`
          );
          if (response.status === 200) {
            const data = await response.json();
            setLista(data);
          } else {
            console.error("Erro ao buscar lançamentos:", response.statusText);
          }
        } catch (error) {
          console.error("Erro ao buscar lançamentos:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLancamentos();
  }, [session]);

  const editar = (lancamento: Lancamento) => {
    if (lancamento?.id) {
      const url = `/cadastros/receitas?id=${lancamento.id}`;
      router.push(url);
    } else {
      console.error("Lançamento inválido para edição.");
    }
  };

  const deletar = (lancamento: Lancamento) => {
    const id = lancamento?.id;
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
                  <Loader show={isLoading} />

                  {lista.length > 0 ? (
                    <TabelaLancamentos
                      onEdit={editar}
                      onDelete={deletar}
                      lancamentos={lista}
                    />
                  ) : (
                    !isLoading && (
                      <div className="notification is-info">
                        Nenhum lançamento encontrado.
                      </div>
                    )
                  )}

                  {messages.map((msg, index) => (
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
