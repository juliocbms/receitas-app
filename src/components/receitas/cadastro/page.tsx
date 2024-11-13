"use client";

import { useState } from 'react';
import { Layout, Input } from "@/components/page";
import React from "react";

export const CadastroReceitas: React.FC = () => {

    const [receita, setReceita] = useState<string>('');
    const [valor, setValor] = useState<string>('');
    const [data, setData] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [descricao, setDescricao] = useState<string>('');

    const submit = () => {
        const lancamento = {
            receita,
            valor,
            data,
            nome,
            descricao,
        };
        console.log(lancamento);
    };

    return (
        <Layout titulo="Cadastro de Receitas">
            <div className="columns">
                <Input
                    label="Tipo Receita: *"
                    columnClasses="is-one-third"
                    onChange={setReceita}
                    value={receita}
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
                    placeholder='Digite um valor'
                />

                <Input
                    label="Data: *"
                    columnClasses="is-one-third"
                    onChange={setData}
                    value={data}
                    id="inputData"
                    type='input'
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
                    type='input'
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
                    type='textarea'
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
