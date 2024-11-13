export interface Lancamento {
    id?: number;
    nome?: string;
    valor?: number;
    data?: Date; // Ou "data?: number" se você preferir armazenar como timestamp (milissegundos desde 1970)
    descricao?: string;
    lancamentos?: 'RECEITA' | 'DESPESA'; // Definindo valores possíveis para o campo 'lancamentos'
    usuario?: number;
    mes?: number; // Mês (1-12)
    ano?: number; // Ano
    dia?: number; 
    tipo?: string;
}
