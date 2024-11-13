import React, { ChangeEvent, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";


interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange?: (value: string) => void;
    label: string;
    columnClasses?: string;
    value: string;
    id: string;
}


interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    onChange?: (value: string) => void;
    label: string;
    columnClasses?: string;
    value: string;
    id: string;
}

interface TextareaInputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    onChange?: (value: string) => void;
    label: string;
    columnClasses?: string;
    value: string;
    id: string;
}


type InputProps =
    | (SelectInputProps & { type: "select" })
    | (TextInputProps & { type: "input" })
    | (TextareaInputProps & { type: "textarea" });


export const Input: React.FC<InputProps> = ({
    onChange,
    label,
    columnClasses,
    id,
    value,
    type,
    ...rest
}) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(event.target.value);
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
            </div>
        );
    }

    return (
        <div className={`field column ${columnClasses}`}>
            <label className="label" htmlFor={id}>{label}</label>
            <input
                id={id}
                value={value}
                onChange={handleChange}
                className="input"
                {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            />
        </div>
    );
};
