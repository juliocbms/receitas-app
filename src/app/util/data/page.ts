export const formatarData = (value: string): string => {
    // Verifica se a data está no formato YYYY-MM-DD (10 caracteres)
    if (value.length === 10 && value.includes("-")) {
        const [ano, mes, dia] = value.split("-");

        // Retorna no formato DD/MM/YYYY
        return `${dia}/${mes}/${ano}`;
    }
    // Verifica se a data está no formato YYYYMMDD ou DDMMYYYY (8 caracteres)
    else if (value.length === 8) {
        // Se a data estiver no formato YYYYMMDD
        if (/^\d{8}$/.test(value)) {
            // Formata como DD/MM/YYYY
            return `${value.substring(6, 8)}/${value.substring(4, 6)}/${value.substring(0, 4)}`;
        }
    }
    // Verifica se a data está no formato DDMM (4 caracteres)
    else if (value.length === 4) {
        // Formata parcialmente DDMM para DD/MM
        return value.replace(/(\d{2})(\d{2})/, "$1/$2");
    }

    // Caso a data não esteja no formato esperado, mantém o valor original
    return value;
};
