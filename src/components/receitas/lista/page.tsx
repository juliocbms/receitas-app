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

interface LayoutProps {
    titulo?: string;
    children?: ReactNode;
    mensagens?: Array<Alert>;
}

export const LayoutLista: React.FC<LayoutProps> = ({ titulo, children, mensagens }) => {
    const { data: result, error } = useSWR<AxiosResponse<Lancamento[]>>('/api/lancamentos?usuario=1', (url: string) => httpClient.get(url));
    const router = useRouter();
    // Verifica se houve um erro ao carregar os dados
    if (error) {
        return <div>Erro ao carregar dados</div>;
    }

    const editar = (lancamento: Lancamento) => {
        const url = `/cadastros/receitas?id=${lancamento.id}`;
        router.push(url); // Atualizado
    };

    const deletar = (lancamento: Lancamento) => {
        console.log(lancamento);  // Aqui você pode adicionar a lógica de exclusão
    };

    return (
        <div className="app">
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
                                    <TabelaLancamentos onEdit={editar} onDelete={deletar} lancamentos={result?.data || []} />
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
