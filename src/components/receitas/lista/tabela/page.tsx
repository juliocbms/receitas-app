import { Lancamento } from "@/app/models/lancamentos/page";
import { useState } from "react";

interface TabelaLancamentosProps {
    lancamentos: Array<Lancamento>;
    onEdit: (lancamento: Lancamento) => void;
    onDelete: (lancamento: Lancamento) => void;
}

export const TabelaLancamentos: React.FC<TabelaLancamentosProps> = ({
    lancamentos,
    onDelete,
    onEdit
}) => {
    return (
        <table className="table is-hoverable is-narrow is-fullwidth is-striped">
            <thead>
                <tr>
                    <th><abbr title="ID do Lançamento">ID</abbr></th>
                    <th><abbr title="Nome do Lançamento">Nome</abbr></th>
                    <th><abbr title="Descrição do Lançamento">Descrição</abbr></th>
                    <th><abbr title="Valor do Lançamento">Valor</abbr></th>
                    <th><abbr title="Tipo do Lançamento">Tipo</abbr></th>
                    <th><abbr title="Data do Lançamento">Data Lançamento</abbr></th>
                    
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {lancamentos.map(lancamento => <LancamentoRow onDelete={onDelete}
                    onEdit={onEdit}
                    key={lancamento.id}
                    lancamento={lancamento} />)}
            </tbody>
        </table>
    );
};

interface LancamentoRowProps {
    lancamento: Lancamento;
    onEdit: (lancamento: Lancamento) => void;
    onDelete: (lancamento: Lancamento) => void;
}

const LancamentoRow: React.FC<LancamentoRowProps> = ({ lancamento, onDelete, onEdit }) => {

    const [deletando, setDeletando] = useState<boolean>(false)

    const onDeletePop = (lancamento: Lancamento) =>{
        if(deletando){
            onDelete(lancamento)
            setDeletando(false)
        }else{
            setDeletando(true)
        }
    }

    const cancelaDelete = ( ) => setDeletando(false)

    return (
        <tr>
            <td>{lancamento.id}</td>
            <td>{lancamento.nome}</td>
            <td>{lancamento.descricao}</td>
            <td>{lancamento.valor}</td>
            <td>{lancamento.tipo}</td>
            <td>{lancamento.datalancamento}</td>
            
            
            <td>
                {!deletando &&
                    <button onClick={e => onEdit(lancamento)} className="button is-success is-rounded is-small">Editar</button>
                }
                <button onClick={e => onDeletePop(lancamento)} className="button is-danger is-rounded is-small">
                    { deletando ? "Confirmar?" : "Deletar"}</button>    
                {deletando &&
                    <button onClick={cancelaDelete} className="button  is-rounded is-small">Cancelar</button>
                }           
                
            </td>
        </tr>
    );
};
