import React, { ChangeEvent, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { formatReal } from "@/app/util/money/page";


interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange?: (value: string) => void;
    label: string;
    columnClasses?: string;
    value: string;
    id: string;
    currency?: boolean
    error?: string;
    type?: string
    email?: string;
}


interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    onChange?: (value: string) => void;
    label: string;
    columnClasses?: string;
    value: string;
    id: string;
    currency?: boolean
    error?: string;
    email?: string;
}

interface TextareaInputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    onChange?: (value: string) => void;
    label: string;
    columnClasses?: string;
    value: string;
    id: string;
    currency?: boolean
    error?: string;
    type?: string
    email?: string;
}


type InputProps =
    | (SelectInputProps & { type: "select" })
    | (TextInputProps & { type: "input"  | "password" | "email"})
    | (TextareaInputProps & { type: "textarea" });


export const Input: React.FC<InputProps> = ({
    onChange,
    label,
    columnClasses,
    id,
    value,
    type,
    currency,
    error,
    email,
    ...rest
}) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        if (!event.target) return; // Garante que event.target existe
    
        let value = event.target.value;
    
        if (value && currency) {
            value = formatReal(value); // Formata como moeda, se necessário
        }
    
        if (onChange) {
            onChange(value); // Passa o valor atualizado para o handler pai
        }
    };


    if (type === "select") {
        return (
            <div className={`field column ${columnClasses}`}>
                <label className="label" htmlFor={id}>{label}</label>
                <div className="select is-normal">
                    <select
                        id={id}
                        value={value}
                        onChange={handleChange}
                        {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
                    >
                        <option value="" disabled hidden>
                            Selecione uma opção
                        </option>
                        <option value="Receita">Receita</option>
                        <option value="Despesa">Despesa</option>
                    </select>
                </div>
                {error && <p className="help is-danger">{error}</p>}
            </div>
        );
    }

    if (type === "textarea") {
        return (
            <div className={`field column ${columnClasses}`}>
                <label className="label" htmlFor={id}>{label}</label>
                <textarea
                    id={id}
                    value={value}
                    onChange={handleChange}
                    className="textarea"
                    {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />
                {error && <p className="help is-danger">{error}</p>}
            </div>
        );
    }

    return (
        <div className={`field column ${columnClasses}`}>
            <label className="label" htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={handleChange}
                className="input"
                {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            />
            {error && <p className="help is-danger">{error}</p>}
        </div>
    );
};