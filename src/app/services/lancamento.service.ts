import { Lancamento } from '@/app/models/lancamentos/page';

const resourceURL: string = "http://localhost:8080/api/lancamentos"; // Ajuste conforme necessário

export const useLancamentoService = () => {

    // Função para obter o token Bearer
    const getToken = (): string | null => {
        const token = localStorage.getItem("authToken"); // Obtenha o token armazenado no localStorage
        return token;
    };

    const salvar = async (lancamento: Lancamento): Promise<Lancamento> => {
        try {
            const url = resourceURL;
            const token = getToken(); // Obtém o token de autenticação

            if (!token) {
                throw new Error('Token de autenticação não encontrado.');
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Adiciona o token no cabeçalho
                },
                body: JSON.stringify(lancamento),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Obtenha o corpo da resposta de erro
                throw new Error(`Erro ao salvar o lançamento: ${response.status} - ${errorText}`);
            }

            const data: Lancamento = await response.json();
            return data;

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Erro ao realizar a requisição:", error);
                throw new Error(`Erro ao salvar o lançamento: ${error.message}`);
            } else {
                console.error("Erro desconhecido:", error);
                throw new Error("Erro desconhecido ao salvar o lançamento.");
            }
        }
    };

    const atualizar = async (lancamento: Lancamento): Promise<void> => {
        const url: string = `${resourceURL}/${lancamento.id}/atualizar`;
        const token = getToken(); // Obtém o token de autenticação

        if (!token) {
            throw new Error('Token de autenticação não encontrado.');
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Adiciona o token no cabeçalho
            },
            body: JSON.stringify(lancamento),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar o lançamento');
        }
    };

    const carregarProduto = async (id: number): Promise<Lancamento> => {
        const url: string = `${resourceURL}/${id}`;
        const token = getToken(); // Obtém o token de autenticação

        if (!token) {
            throw new Error('Token de autenticação não encontrado.');
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Adiciona o token no cabeçalho
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar o produto');
        }

        const data: Lancamento = await response.json();
        return data;
    };

    const deletar = async (id: string): Promise<void> => {
        const url: string = `${resourceURL}/${id}`;
        const token = getToken(); // Obtém o token de autenticação

        if (!token) {
            throw new Error('Token de autenticação não encontrado.');
        }

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,  // Adiciona o token no cabeçalho
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar o lançamento');
        }
    };

    const listar = async (): Promise<Lancamento[]> => {
        const token = getToken(); // Obtém o token de autenticação

        if (!token) {
            throw new Error('Token de autenticação não encontrado.');
        }

        const response = await fetch(resourceURL, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Adiciona o token no cabeçalho
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao listar os lançamentos');
        }

        const data: Lancamento[] = await response.json();
        return data;
    };

    return {
        salvar,
        atualizar,
        carregarProduto,
        deletar,
        listar
    };
};
