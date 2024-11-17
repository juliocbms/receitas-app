import { Lancamento } from "@/app/models/lancamentos/page";

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
    return (
        <tr>
            <td>{lancamento.id}</td>
            <td>{lancamento.nome}</td>
            <td>{lancamento.descricao}</td>
            <td>{lancamento.valor}</td>
            <td>{lancamento.tipo}</td>
            <td>{lancamento.datalancamento}</td>
            
            <td>
                <button onClick={e => onEdit(lancamento)} className="button is-success is-rounded is-small">Editar</button>
                <button onClick={e => onDelete(lancamento)} className="button is-danger is-rounded is-small">Deletar</button>
            </td>
        </tr>
    );
};
