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
import useSWR, { mutate } from "swr";


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
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Data deve estar no formato dd/mm/yyyy"),
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
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [datacadastro, setDataCadastro] = useState<string>("");
     

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setIsEditMode(true); // Habilita o modo de edição
            service.carregarProduto(Number(id))
                .then((lancamento: Lancamento) => {
                    setId(lancamento.id);
                    setLancamentoTipo(lancamento.tipo || "");
                    setNome(lancamento.nome || "");
                    setDescricao(lancamento.descricao || "");
                    setValor(lancamento.valor ? lancamento.valor.toString() : "0");
                    setData(formatarData(lancamento.datalancamento || "")); 
                    setDataCadastro(formatarData(lancamento.datacadastro || ""));
                })
                .catch((err) => {
                    setMessages([{
                        tipo: "error",
                        texto: "Erro ao carregar os dados do lançamento",
                    }]);
                });
        }
    }, [searchParams]);

<<<<<<< HEAD
    const handleDateChange = (value: string) => {
        const formattedValue = formatarData(value);
        setData(formattedValue);
=======
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
>>>>>>> 594844f (new commit)
    };
    

    const submit = () => {
        // Converte data para yyyy-mm-dd antes de enviar
        const [dia, mes, ano] = data.split("/");
        const formattedDateForAPI = `${ano}-${mes}-${dia}`;
    
        const lancamento: Lancamento = {
            descricao,
            data: formattedDateForAPI, // Formato yyyy-mm-dd
            datalancamento: formattedDateForAPI,
            valor: converterEmBigDecimal(valor),
            tipo: lancamentoTipo.toUpperCase(),
            usuario: parseInt(usuario),
            nome,
            id,
            datacadastro: formattedDateForAPI
        };
    
        validationSchema
            .validate(lancamento)
            .then(() => {
                setErrors({});
                if (id) {
                    service.atualizar(lancamento).then(() => {
                        setMessages([{
                            tipo: "success",
                            texto: "Lançamento atualizado com sucesso.",
                        }]);
                        mutate('/api/lancamentos?usuario=1');
                    });
                } else {
                    service.salvar(lancamento).then((lancamentoResposta) => {
                        setId(lancamentoResposta.id);
                        setMessages([{
                            tipo: "success",
                            texto: "Lançamento salvo com sucesso.",
                        }]);
                        mutate('/api/lancamentos?usuario=1');
                    });
                }
            })
            .catch((err) => {
                const field = err.path;
                const message = err.message;
                setErrors({ [field]: message });
            });
    };
    return (
        <div>
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
                                value={data} // Aqui é onde você passará a data no formato dd/mm/yyyy
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
