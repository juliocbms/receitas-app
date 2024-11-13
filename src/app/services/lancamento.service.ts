import {httpClient} from '@/app/http/page'
import { Lancamento}  from '@/app/models/lancamentos/page'
import { AxiosResponse } from 'axios'

const resourceURL: string = "/api/lancamentos"


export const useLancamentoService = () => {

    const salvar = async (lancamento: Lancamento): Promise<Lancamento> =>{
        const response: AxiosResponse<Lancamento> = await httpClient.post<Lancamento>(resourceURL, lancamento)
        return response.data
    }

    return{
        salvar
    }
}