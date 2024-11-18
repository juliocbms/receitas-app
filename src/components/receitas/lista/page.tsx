'use client';
import { ReactNode } from 'react';
import { Alert } from '@/components/common/message/page';
import { MenuDois } from './menu/page';
import { TabelaLancamentos } from './tabela/page';
import { Lancamento } from '@/app/models/lancamentos/page';
import useSWR from 'swr';
import { httpClient } from '@/app/http/page';
import { AxiosResponse } from 'axios';
import { Loader } from '@/components/page';
import { useRouter } from 'next/navigation'; 
import { useLancamentoService } from '@/app/services/lancamento.service';
import { useState, useEffect } from "react";


interface LayoutProps {
    titulo?: string;
    children?: ReactNode;
    mensagens?: Array<Alert>;
}

export const LayoutLista: React.FC<LayoutProps> = ({ titulo, children, mensagens }) => {
    const service = useLancamentoService()
    const [messages, setMessages] = useState<Array<Alert>>([]);
    const { data: result, error } = useSWR<AxiosResponse<Lancamento[]>>('/api/lancamentos?usuario=1', (url: string) => httpClient.get(url));
    const router = useRouter();

    const [lista, setLista] = useState<Lancamento[]>([])

    useEffect( () =>{
        setLista(result?.data || [])
    }, [result])
    
    if (error) {
        console.error('Erro ao carregar dados dos lançamentos', error);
        return <div>Erro ao carregar dados</div>;
    }
    
  

    const editar = (lancamento: Lancamento) => {
        const url = `/cadastros/receitas?id=${lancamento.id}`;
        router.push(url); 
    };

    const deletar = (lancamento: Lancamento) => {
        const id = Number(lancamento.id); // Forçar conversão para número
        if (id) {
            service.deletar(id).then(response => {
                setMessages([
                    { tipo: "success", texto: "Produto excluído com sucesso!" }
                ]);
            }).catch(error => {
                console.error("Erro ao excluir produto", error);
            });
        } else {
            console.error('ID do lançamento não é válido');
        } const listaAlterada: Lancamento[] = lista?.filter( l => l.id !== lancamento.id)
        setLista(listaAlterada)
    };
    

    return (
        <div className="app" >
            <section className="main-content columns is-fullheight">
                <MenuDois />
                <div className="container column is-10">
                    <div className="section">
                        <div className="card">
                            <div className="card-header">
                                <p className="card-header-title">{'Lista de Lançamentos'}</p>
                            </div>
                            <div className="card-content">
                                <div className="content">
                                    <Loader show={!result} />
                                    <TabelaLancamentos onEdit={editar} onDelete={deletar} lancamentos={lista} />
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
