import { ReactNode } from 'react';
import { Message } from '../common/message/page'; // Importando mensagens de erro ou sucesso

interface LayoutProps {
  titulo: string;
  children: ReactNode;
  mensagens?: Array<{ tipo: string; texto: string }>; // Mensagens de erro ou sucesso
}

export const Layout: React.FC<LayoutProps> = ({ titulo, children, mensagens }) => {
  return (
    <div className="app">
    <section className="main-content columns is-fullheight">
        <div className="container column is-6">
            <div className="section is-medium">
                <div className="card">
                    <div className="card-header">
                        <p className="card-header-title">
                            {titulo}
                        </p>
                    </div>
                    <div className="card-content">
                        <div className="content">
                {mensagens && mensagens.map((msg, index) => (
                  <Message key={index} tipo={msg.tipo} texto={msg.texto} />
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
