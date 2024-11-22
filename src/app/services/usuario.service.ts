import { httpClient } from '../http/page'
import { Usuario } from '../models/login/page'
import { AxiosResponse } from 'axios'


const resourceURL: string = "/api/usuarios"

export const useUsuarioService = () => {

    const salvar = async (usuario: Usuario) : Promise<Usuario> => {
        const response: AxiosResponse<Usuario> = await httpClient.post<Usuario>(resourceURL, usuario);
        return response.data;
    }



    const carregarUsuario = async (id: any) : Promise<Usuario> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Usuario> = await httpClient.get(url);
        return response.data;
    }

    const deletar = async (id: any) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

       

    return {
        salvar,
        carregarUsuario,
        deletar,
        
    }
}