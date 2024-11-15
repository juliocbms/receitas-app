// CadastroLancamentos.tsx
"use client";

import { useState } from 'react';
import { Layout, Input } from "@/components/page";
import React from "react";
import { useLancamentoService } from '@/app/services/page';
import { Lancamento } from '@/app/models/lancamentos/page';
import { converterEmBigDecimal } from '@/app/util/money/page';
import { formatarData } from '@/app/util/data/page';  

export const CadastroLancamentos: React.FC = () => {
    const service = useLancamentoService();
    const [lancamentos, setLancamento] = useState<string>(''); 
    const [valor, setValor] = useState<string>('');
    const [data, setData] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [descricao, setDescricao] = useState<string>('');
    const [usuario, setUsuario] = useState<string>('1');
    const [id, setId] = useState<string | undefined>('') 

    const handleDateChange = (value: string) => {
        setData(formatarData(value)); // Use a função importada para formatar a data
    };

    const submit = () => {
        if (!lancamentos) {
            alert('Por favor, selecione o tipo de lançamento!');
            return;
        }

        const formattedDate = data.replace(/\D/g, ''); 
        if (formattedDate.length !== 8) {
            alert('Por favor, forneça uma data válida no formato dd/mm/yyyy.');
            return;
        }

        const dia = parseInt(formattedDate.slice(0, 2), 10);
        const mes = parseInt(formattedDate.slice(2, 4), 10);
        const ano = parseInt(formattedDate.slice(4, 8), 10);

        const dataDate = new Date(ano, mes - 1, dia);
        if (isNaN(dataDate.getTime()) || dataDate.getDate() !== dia) {
            alert('Data inválida! Por favor, insira uma data existente.');
            return;
        }

        const formattedDateForAPI = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

        const lancamento: Lancamento = {
            descricao,
            dia,
            datalancamento: formattedDateForAPI, 
            mes,
            ano,
            valor: converterEmBigDecimal(valor),
            tipo: lancamentos.toUpperCase(),
            usuario: parseInt(usuario),
            nome,
            id
        };

        if(id){
            service.atualizar(lancamento)
            .then(response => console.log("Lançamento Atualizado!"))

        }else{
            service
            .salvar(lancamento)
            .then(lancamentoResposta => {
                console.log(lancamentoResposta)
                setId(lancamentoResposta.id)
            })
            
            .catch(error => {
                console.error("Erro ao salvar lançamento", error);
                alert('Erro ao salvar lançamento. Tente novamente.');
            });
        }
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
                    currency
                    maxLength={16}
                />

                <Input
                    label="Data: *"
                    columnClasses="is-one-third"
                    onChange={handleDateChange} 
                    value={data}
                    id="inputData"
                    type="input"
                    placeholder="Digite uma data "
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
                    <button onClick={submit} className="button is-link">
                        {id ? "Atualizar" : "Salvar"}
                    </button>
                </div>
                <div className="control">
                    <button className="button is-link is-light">Voltar</button>
                </div>
            </div>
        </Layout>
    );
};
