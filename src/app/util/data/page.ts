export const formatarData = (value: string): string => {
    if (!value) return "";
    
    // Se estiver no formato yyyy-mm-dd, converte para dd/mm/yyyy
    if (value.includes("-")) {
        const [ano, mes, dia] = value.split("-");
        
        // Retorna no formato DD/MM/YYYY
        return `${dia}/${mes}/${ano}`;
    }
    
    // Se a data estiver no formato YYYYMMDD ou DDMMYYYY (8 caracteres)
    else if (value.length === 8) {
        // Se a data estiver no formato YYYYMMDD
        if (/^\d{8}$/.test(value)) {
            // Formata como DD/MM/YYYY
            return `${value.substring(6, 8)}/${value.substring(4, 6)}/${value.substring(0, 4)}`;
        }
    }

    // Se a data estiver no formato DDMM (4 caracteres)
    else if (value.length === 4) {
        // Formata parcialmente DDMM para DD/MM
        return value.replace(/(\d{2})(\d{2})/, "$1/$2");
    }

    // Caso a data não esteja no formato esperado, retorna o valor original
    return value;
};
