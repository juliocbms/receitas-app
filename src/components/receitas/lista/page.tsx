import { ReactNode } from 'react';
import { Alert } from '@/components/common/message/page';
import { MenuDois } from './menu/page';

interface LayoutProps {
    titulo?: string;
    children?: ReactNode;
    mensagens?: Array<Alert>;
}

export const LayoutLista: React.FC<LayoutProps> = ({ titulo, children, mensagens }) => {
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
                                    {/* Renderizar o conteúdo filho (Lista de lançamentos) */}
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
