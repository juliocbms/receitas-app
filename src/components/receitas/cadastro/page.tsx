"use client";

import { useState } from 'react';
import { Layout, Input } from "@/components/page";
import React from "react";
import { useLancamentoService } from '@/app/services/page';
import { Lancamento } from '@/app/models/lancamentos/page';

export const CadastroLancamentos: React.FC = () => {
    const service = useLancamentoService();
    const [lancamentos, setLancamento] = useState<string>(''); // Sem valor padrão, espera-se que o usuário escolha
    const [valor, setValor] = useState<string>('');
    const [data, setData] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [descricao, setDescricao] = useState<string>('');
    const [usuario, setUsuario] = useState<string>('1'); // Defina um valor padrão para o usuário

    const submit = () => {
        if (!lancamentos) {
            alert('Por favor, selecione o tipo de lançamento!');
            return;
        }

        // Verificação da data antes de extrair o mês e o ano
        const dataDate = new Date(data); 
        if (isNaN(dataDate.getTime())) { // Se a data for inválida
            alert('Por favor, forneça uma data válida.');
            return;
        }

        const mes = dataDate.getMonth() + 1; // O mês no JavaScript começa do 0 (janeiro é 0)
        const ano = dataDate.getFullYear();

        // Validação de mês
        if (mes < 1 || mes > 12) {
            alert('Informe um mês válido (1-12).');
            return;
        }

        const lancamento: Lancamento = {
            descricao,
            mes,
            ano,
            valor: parseFloat(valor),
            tipo: lancamentos.toUpperCase(), // O tipo precisa ser "RECEITA" ou "DESPESA"
            usuario: parseInt(usuario), // Converte o usuário para número
            nome,
        };

        service
            .salvar(lancamento)
            .then(lancamentoResposta => console.log(lancamentoResposta))
            .catch(error => {
                console.error("Erro ao salvar lançamento", error);
                alert('Erro ao salvar lançamento. Tente novamente.');
            });
    };

    return (
        <Layout titulo="Cadastro de Lançamentos">
            <div className="columns">
                <Input
                    label="Tipo Lançamento: *"
                    columnClasses="is-one-third"
                    onChange={setLancamento}
                    value={lancamentos}
                    id="tipoReceita"
                    type="select"
                />

                <Input
                    label="Valor: *"
                    columnClasses="is-one-third"
                    onChange={setValor}
                    value={valor}
                    id="inputValor"
                    type="input"
                    placeholder="Digite um valor"
                />

                <Input
                    label="Data: *"
                    columnClasses="is-one-third"
                    onChange={setData}
                    value={data}
                    id="inputData"
                    type="input"
                    placeholder="Digite uma data"
                />
            </div>

            <div className="columns">
                <Input
                    label="Nome: *"
                    columnClasses="is-full"
                    onChange={setNome}
                    value={nome}
                    id="inputNome"
                    type="input"
                    placeholder="Digite um nome "
                />
            </div>

            <div className="columns">
                <Input
                    label="Descrição: *"
                    columnClasses="is-full"
                    onChange={setDescricao}
                    value={descricao}
                    id="inputDescricao"
                    type="textarea"
                    placeholder="Digite uma descrição"
                />
            </div>

            <div className="field is-grouped">
                <div className="control">
                    <button onClick={submit} className="button is-link">Salvar</button>
                </div>
                <div className="control">
                    <button className="button is-link is-light">Voltar</button>
                </div>
            </div>
        </Layout>
    );
};
