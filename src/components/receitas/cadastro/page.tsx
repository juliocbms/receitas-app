"use client";

import { useState, useEffect } from "react";
import { Layout, Input } from "@/components/page";
import React from "react";
import { useLancamentoService } from "@/app/services/page";
import { Lancamento } from "@/app/models/lancamentos/page";
import { converterEmBigDecimal } from "@/app/util/money/page";
import { formatarData } from "@/app/util/data/page";
import { Alert } from "@/components/common/message/page";
import { LayoutLista } from "@/components/page"; // Para a lista de lançamentos
import * as yup from "yup";

const msgCampoObrigatorio = "Campo Obrigatório";

const validationSchema = yup.object().shape({
    tipo: yup.string().trim().required(msgCampoObrigatorio),
    nome: yup.string().trim().required(msgCampoObrigatorio),
    descricao: yup.string().trim().required(msgCampoObrigatorio),
    valor: yup
        .number()
        .required(msgCampoObrigatorio)
        .moreThan(0, " Valor deve ser maior do que 0,00 (Zero)"),
    data: yup
        .string()
        .required(msgCampoObrigatorio)
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, " Data deve estar no formato dd/MM/yyyy"),
});

interface FormErros {
    tipo?: string;
    valor?: string;
    data?: string;
    nome?: string;
    descricao?: string;
}

export const CadastroLancamentos: React.FC = () => {
    const service = useLancamentoService();

    const [lancamentos, setLancamento] = useState<string>(""); 
    const [valor, setValor] = useState<string>("");
    const [data, setData] = useState<string>("");
    const [nome, setNome] = useState<string>("");
    const [descricao, setDescricao] = useState<string>("");
    const [usuario, setUsuario] = useState<string>("1");
    const [id, setId] = useState<string | undefined>("");
    const [messages, setMessages] = useState<Array<Alert>>([]);
    const [erros, setErrors] = useState<FormErros>({});
    const [listaLancamentos, setListaLancamentos] = useState<Lancamento[]>([]);

    // Função para formatar a data
    const handleDateChange = (value: string) => {
        const formattedValue = formatarData(value);
        setData(formattedValue); 
    };

    const submit = () => {
        const formattedDate = data.replace(/\D/g, "");
        const dia = parseInt(formattedDate.slice(0, 2), 10);
        const mes = parseInt(formattedDate.slice(2, 4), 10);
        const ano = parseInt(formattedDate.slice(4, 8), 10);

        const formattedDateForAPI = `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        const lancamento: Lancamento = {
            descricao,
            data, 
            datalancamento: formattedDateForAPI, 
            dia,
            mes,
            ano,
            valor: converterEmBigDecimal(valor),
            tipo: lancamentos.toUpperCase(),
            usuario: parseInt(usuario),
            nome,
            id,
        };

        validationSchema
            .validate(lancamento)
            .then(() => {
                setErrors({});
                if (id) {
                    service.atualizar(lancamento).then(() => {
                        setMessages([{
                            tipo: "success",
                            texto: "Produto atualizado com sucesso.",
                        }]);
                        // Atualizar lista de lançamentos
                        
                    });
                } else {
                    service.salvar(lancamento).then((lancamentoResposta) => {
                        setId(lancamentoResposta.id);
                        setMessages([{
                            tipo: "success",
                            texto: "Produto salvo com sucesso.",
                        }]);
                        // Atualizar lista de lançamentos
                        
                    });
                }
            })
            .catch((err) => {
                const field = err.path;
                const message = err.message;

                setErrors({
                    [field]: message
                });
            });
    };

    

    return (
        <div>
            {/* Layout de Cadastro */}
            <Layout titulo="Cadastro de Lançamentos" mensagens={messages}>
                <section className="section">
                    <div className="columns">
                        <Input
                            label="Tipo Lançamento: *"
                            columnClasses="is-one-third"
                            onChange={setLancamento}
                            value={lancamentos}
                            id="tipoReceita"
                            type="select"
                            error={erros.tipo}
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
                            error={erros.valor}
                        />
                        <Input
                            label="Data: *"
                            columnClasses="is-one-third"
                            onChange={handleDateChange}
                            value={data}
                            id="inputData"
                            type="input"
                            placeholder="Digite uma data"
                            error={erros.data}
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
                            placeholder="Digite um nome"
                            error={erros.nome}
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
                            error={erros.descricao}
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
                </section>
            </Layout>

            {/* Layout de Lista */}
            <LayoutLista titulo="">
                <section className="section">
                    <div className="columns">
                        {listaLancamentos.length > 0 ? (
                            listaLancamentos.map((lancamento) => (
                                <div key={lancamento.id} className="card">
                                    <div className="card-content">
                                        <p><strong>{lancamento.nome}</strong></p>
                                        <p>{lancamento.descricao}</p>
                                        <p>Valor: {lancamento.valor}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Não há lançamentos cadastrados.</p>
                        )}
                    </div>
                </section>
            </LayoutLista>
        </div>
    );
};
