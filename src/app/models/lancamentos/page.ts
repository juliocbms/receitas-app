export interface Lancamento {
    id?: string ;
    nome?: string;
    valor?: number;
    data?: string; 
    descricao?: string;
    lancamentos?: 'RECEITA' | 'DESPESA'; 
    usuario?: number;
    datalancamento?: string | undefined;
    datacadastro?: string | undefined;
    mes?: number; 
    ano?: number; 
    dia?: number; 
    tipo?: string;
}
