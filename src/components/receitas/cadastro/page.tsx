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
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";



const msgCampoObrigatorio = "Campo Obrigatório";

const validationSchema = yup.object().shape({
    tipo: yup.string().trim().required(msgCampoObrigatorio),
    nome: yup.string().trim().required(msgCampoObrigatorio),
    descricao: yup.string().trim().required(msgCampoObrigatorio),
    valor: yup
        .number()
        .required(msgCampoObrigatorio)
        .moreThan(0, "Valor deve ser maior do que 0,00 (Zero)"),
    data: yup
        .string()
        .required(msgCampoObrigatorio)
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Data deve estar no formato dd/MM/yyyy"),
});

interface FormErros {
    tipo?: string;
    valor?: string;
    data?: string;
    nome?: string;
    descricao?: string;
}

export const CadastroLancamentos: React.FC = () => {
    const { data: session } = useSession();
    const service = useLancamentoService();  
    const searchParams = useSearchParams()
    const [lancamentoTipo, setLancamentoTipo] = useState<string>(""); 
    const [valor, setValor] = useState<string>(""); 
    const [data, setData] = useState<string>(""); 
    const [nome, setNome] = useState<string>(""); 
    const [descricao, setDescricao] = useState<string>(""); 
    const [usuario, setUsuario] = useState<string>("40"); 
    const [id, setId] = useState<string | undefined>(""); 
    const [messages, setMessages] = useState<Array<Alert>>([]); 
    const [erros, setErrors] = useState<FormErros>({}); 
    const [listaLancamentos, setListaLancamentos] = useState<Lancamento[]>([]);

    const usuarioid = session?.user?.id;
    // Carregar dados do lançamento caso o id esteja presente na URL
    useEffect(() => {
        const id = searchParams.get("id"); // Pega o id da URL
        
        if (id) {
            service.carregarProduto(Number(id))
                .then((lancamento: Lancamento) => {
                    setId(lancamento.id);
                    setLancamentoTipo(lancamento.tipo || "");
                    setNome(lancamento.nome || "");
                    setDescricao(lancamento.descricao || "");
                    setValor(lancamento.valor ? lancamento.valor.toString() : "0");
                    const formattedDate = formatarData(lancamento.datalancamento || ""); 
                    setData(formattedDate); 
                })
                .catch((err) => {
                    setMessages([{
                        tipo: "error",
                        texto: "Erro ao carregar os dados do lançamento",
                    }]);
                });
        }
    }, [searchParams]);

    const handleDateChange = (value: string) => {
        let cleanedValue = value.replace(/\D/g, "");
        if (cleanedValue.length <= 2) {
            cleanedValue = cleanedValue.replace(/(\d{2})/, "$1");
        } else if (cleanedValue.length <= 4) {
            cleanedValue = cleanedValue.replace(/(\d{2})(\d{2})/, "$1/$2");
        } else {
            cleanedValue = cleanedValue.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
        }
        setData(cleanedValue);
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
            tipo: lancamentoTipo.toUpperCase(),
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
                        service.listar().then(setListaLancamentos);
                    });
                } else {
                    service.salvar(lancamento).then((lancamentoResposta) => {
                        setId(lancamentoResposta.id);
                        setMessages([{
                            tipo: "success",
                            texto: "Produto salvo com sucesso.",
                        }]);
                        // Atualizar lista de lançamentos
                        service.listar().then(setListaLancamentos);
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
            <div></div>
            <Layout titulo="Cadastro de Lançamentos" mensagens={messages}>
                <section className="section">
                    <div className="columns">
                        <Input
                            label="Tipo Lançamento: *"
                            columnClasses="is-one-third"
                            onChange={setLancamentoTipo}
                            value={lancamentoTipo}
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

            <LayoutLista titulo="Lista de Lançamentos">
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
                            <p>Nenhum lançamento encontrado.</p>
                        )}
                    </div>
                </section>
            </LayoutLista>
        </div>
    );
};
