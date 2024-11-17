import { httpClient } from '@/app/http/page';
import { Lancamento } from '@/app/models/lancamentos/page';
import { AxiosResponse } from 'axios';

const resourceURL: string = "/api/lancamentos";

export const useLancamentoService = () => {

    const salvar = async (lancamento: Lancamento): Promise<Lancamento> => {
        const response: AxiosResponse<Lancamento> = await httpClient.post<Lancamento>(resourceURL, lancamento);
        return response.data;
    };

    const atualizar = async (lancamento: Lancamento): Promise<void> => {
        const url: string = `${resourceURL}/${lancamento.id}/atualizar`;
        await httpClient.put<Lancamento>(url, lancamento);
    };

    const carregarProduto = async (id: number): Promise<Lancamento> => {
        const url: string = `${resourceURL}/${id}`;
        const response: AxiosResponse<Lancamento> = await httpClient.get(url);
        return response.data;
    };

    return {
        salvar,
        atualizar,
        carregarProduto,  // Certifique-se de retornar a função
    };
};
