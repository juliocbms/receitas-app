export const formatarData = (value: string): string => {
    if (!value) return "";
    
    // Se estiver no formato yyyy-mm-dd, converte para dd/mm/yyyy
    if (value.includes("-")) {
        const [ano, mes, dia] = value.split("-");
        return `${dia}/${mes}/${ano}`;
    }
    
    // Remove caracteres não numéricos
    value = value.replace(/\D/g, "");

    // Formata DDMMYYYY para DD/MM/YYYY
    if (value.length === 8) {
        value = value.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    } else if (value.length > 4) {
        // Formata parcialmente DDMM para DD/MM
        value = value.replace(/(\d{2})(\d{2})/, "$1/$2");
    }

    return value;
};
