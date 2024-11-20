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
import { useRouter, useSearchParams } from "next/navigation";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


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
    const service = useLancamentoService();  
    const searchParams = useSearchParams()
    const [lancamentoTipo, setLancamentoTipo] = useState<string>("");
    const [valor, setValor] = useState<string>(""); 
    const [data, setData] = useState<string>(""); 
    const [nome, setNome] = useState<string>(""); 
    const [descricao, setDescricao] = useState<string>(""); 
    const [usuario, setUsuario] = useState<string>("1");
    const [id, setId] = useState<string | undefined>(""); 
    const [messages, setMessages] = useState<Array<Alert>>([]);
    const [erros, setErrors] = useState<FormErros>({}); 
    const [listaLancamentos, setListaLancamentos] = useState<Lancamento[]>([]);

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
                    
                    // Formatar a data para exibição no formato DD/MM/YYYY
                    const formattedDate = formatarData(lancamento.datalancamento || ""); // Formata a data para DD/MM/YYYY
                    setData(formattedDate);  // Agora a data está no formato correto para exibição
                })
                .catch((err) => {
                    setMessages([{
                        tipo: "error",
                        texto: "Erro ao carregar os dados do lançamento",
                    }]);
                });
        }
    }, [searchParams]);
    
     // A dependência é o id, então a função será chamada quando o id mudar

     const handleDateChange = (value: string) => {
        // Remove qualquer coisa que não seja número (para permitir apenas os números)
        let cleanedValue = value.replace(/\D/g, "");
        
        // Formatar a data automaticamente com a barra
        if (cleanedValue.length <= 2) {
            // Se o número de caracteres for <= 2, formato como DD
            cleanedValue = cleanedValue.replace(/(\d{2})/, "$1");
        } else if (cleanedValue.length <= 4) {
            // Se o número de caracteres for <= 4, formato como DD/MM
            cleanedValue = cleanedValue.replace(/(\d{2})(\d{2})/, "$1/$2");
        } else {
            // Se o número de caracteres for <= 8, formato como DD/MM/YYYY
            cleanedValue = cleanedValue.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
        }
    
        setData(cleanedValue); // Atualiza o estado com o valor formatado
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
                            <br></br>
                        )}
                    </div>
                </section>
            </LayoutLista>
        </div>
    );
};
