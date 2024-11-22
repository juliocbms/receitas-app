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
  const { data: session } = useSession();
  const service = useLancamentoService();
  const [messages, setMessages] = useState<Array<Alert>>([]);
  const [lista, setLista] = useState<Lancamento[]>([]);
  const router = useRouter();

  // Use SWR para buscar os lançamentos com fetch
  const { data: result, error } = useSWR<Lancamento[]>(
    session ? `/api/lancamentos?usuario=${session.user.id}` : null,
    async (url: string) => {
      console.log("Requisição para:", url); // Verifique a URL aqui
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Erro na requisição");
        }
        return res.json();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        throw new Error("Erro ao carregar dados");
      }
    }
  );

  useEffect(() => {
    if (result) {
      setLista(result);
    }
  }, [result]);

  // Caso haja erro, exibe a mensagem de erro
  if (error) {
    console.error("Erro ao carregar dados dos lançamentos", error);
    return <div>Erro ao carregar dados</div>;
  }

  const editar = (lancamento: Lancamento) => {
    const url = `/cadastros/receitas?id=${lancamento.id}`;
    router.push(url);
  };

  const deletar = (lancamento: Lancamento) => {
    const id = Number(lancamento.id); 
    if (id) {
      service.deletar(id).then(() => {
        setMessages([{
          tipo: "success",
          texto: "Produto excluído com sucesso!",
        }]);

        // Atualiza a lista após a exclusão
        setLista((prevLista) => prevLista.filter(l => l.id !== lancamento.id));
      }).catch((err) => {
        console.error("Erro ao excluir produto", err);
        setMessages([{
          tipo: "error",
          texto: "Erro ao excluir o produto.",
        }]);
      });
    } else {
      console.error('ID do lançamento não é válido');
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
                <p className="card-header-title">{titulo || 'Lista de Lançamentos'}</p>
              </div>
              <div className="card-content">
                <div className="content">
                  {/* Loader enquanto os dados são carregados */}
                  <Loader show={!result} />
                  
                  {/* Renderizando a tabela de lançamentos */}
                  <TabelaLancamentos 
                    onEdit={editar} 
                    onDelete={deletar} 
                    lancamentos={lista} 
                  />

                  {/* Exibindo mensagens de sucesso ou erro */}
                  {messages && messages.map((msg, index) => (
                    <div key={index} className={`alert ${msg.tipo}`}>
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
