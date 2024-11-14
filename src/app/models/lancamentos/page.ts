export interface Lancamento {
    id?: number;
    nome?: string;
    valor?: number;
    data?: Date; 
    descricao?: string;
    lancamentos?: 'RECEITA' | 'DESPESA'; 
    usuario?: number;
    dataCadastro?: string;
    mes?: number; 
    ano?: number; 
    dia?: number; 
    tipo?: string;
}
